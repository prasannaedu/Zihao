import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Recipe = () => {
    const [recipes, setRecipes] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [recipeName, setRecipeName] = useState("");
    const [recipeDescription, setRecipeDescription] = useState("");
    const [recipe_price, setRecipePrice] = useState("");
    const [recipeImage, setRecipeImage] = useState(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    // Fetch the token from localStorage
    const getToken = () => localStorage.getItem("access_token");

    const checkAdminStatus = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch("http://127.0.0.1:8000/protected/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('hi')

            if (response.ok) {
                const data = await response.json();
                console.log("Admin Status API Response:", data); // Debug log
                setIsAdmin(data.is_admin);
            } else {
                console.error("Failed to verify admin status.");
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
        }
    };
    // Load recipes from the API
    const loadRecipes = async () => {
        const token = getToken();
        if (!token) {
            alert("You are not logged in. Redirecting to login page.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/recipes/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("API Response:", data);
                console.log('hi')
                setRecipes(data.receipes);
                setLoading(false);
            } else if (response.status === 401) {
                alert("Session expired or unauthorized access. Redirecting to login.");
                navigate("/login");
            } else {
                alert("An error occurred while loading recipes. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching recipes:", error);
            alert("A network error occurred. Please check your connection.");
        }
    };

    // Handle adding a new recipe
    const handleAddRecipe = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) {
            alert("You are not logged in. Redirecting to login page.");
            navigate("/login");
            return;
        }

        const formData = new FormData();
        formData.append("receipe_name", recipeName);
        formData.append("receipe_description", recipeDescription);
        formData.append("receipe_image", recipeImage);
        formData.append("recipe_price", recipe_price);

        try {
            const response = await fetch("http://127.0.0.1:8000/recipes/create/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert("Recipe added successfully!");
                setRecipeName("");
                setRecipeDescription("");
                setRecipePrice("");
                setRecipeImage(null);//still image is not getting cleared, to be fixed we make it null
                loadRecipes();
            } else {
                alert("Failed to add the recipe. Please check the input.");
            }
        } catch (error) {
            console.error("Error adding recipe:", error);
            alert("A network error occurred. Please try again.");
        }
    };
    const handleUpdateRecipe = (id) => {
        navigate(`/update/${id}`); // Navigate to Update.js with the recipe ID
    };

    // Handle deleting a recipe
    const handleDeleteRecipe = async (id) => {
        const token = getToken();
        if (!token) {
            alert("You are not logged in. Redirecting to login page.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/recipes/delete/${id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Recipe deleted successfully!");
                loadRecipes();
            } else {
                alert("Failed to delete the recipe.");
            }
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("A network error occurred. Please try again.");
        }
    };

    // Load recipes on component mount
    useEffect(() => {
        checkAdminStatus(); // Fetch admin status
        loadRecipes(); // Load recipes
    }, []);
    if (loading) {
        return <div>Loading recipes...</div>;
    }

    return (
        <div className="container mt-5">
            {/* Add Recipe Form */}
            <form
                onSubmit={handleAddRecipe}
                className="col-6 mx-auto card p-3 shadow-lg"
            >
                <h2>Add Recipe</h2>
                <div className="mb-3">
                    <label>Recipe Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Recipe Description</label>
                    <textarea
                        className="form-control"
                        value={recipeDescription}
                        onChange={(e) => setRecipeDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Recipe Price</label>
                    <input
                        type="text"
                        className="form-control"
                        value={recipe_price}
                        onChange={(e) => setRecipePrice(e.target.value)}
                        required
                    />

                </div>
                <div className="mb-3">
                    <label>Recipe Image</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setRecipeImage(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">
                    Add Recipe
                </button>
            </form>

            {/* Recipe Table */}
            <table className="table mt-5">
                <thead>
                    <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Recipe Name</th>
                        <th scope="col">Recipe Description</th>
                        <th scope="col">Recipe Image</th>
                        <th scope="col">Recipe Price(in ₹)</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recipes.map((recipe, index) => (
                        <tr key={recipe.id}>
                            <td>{index + 1}</td>
                            <td>{recipe.receipe_name}</td>
                            <td>{recipe.receipe_description}</td>
                            <td>
                                <img
                                    src={`http://127.0.0.1:8000/media/${recipe.receipe_image}`}
                                    alt={recipe.receipe_name}
                                    style={{ height: "100px" }}
                                    />
                            </td>
                            <td  style={{fontWeight: "bold"}}>₹ {recipe.recipe_price}</td>
                            <td>
                                {isAdmin && (
                                <>
                                <button
                                    className="btn btn-success"
                                    // onClick={() =>
                                    //     alert(`Update functionality for Recipe ID ${recipe.id} is not implemented yet.`)
                                    // }
                                    onClick={() => handleUpdateRecipe(recipe.id)}
                                >
                                    Update
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteRecipe(recipe.id)}
                                >
                                    Delete
                                </button>
                                </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Recipe;
