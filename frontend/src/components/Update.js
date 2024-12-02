import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Update = () => {
    const { id } = useParams(); // Get the recipe ID from the URL
    const [recipeName, setRecipeName] = useState("");
    const [recipeDescription, setRecipeDescription] = useState("");
    const [recipeImage, setRecipeImage] = useState("");
    const [recipe_price, setRecipePrice] = useState("");
    const navigate = useNavigate();

    // Fetch the token from localStorage
    const getToken = () => localStorage.getItem("access_token");

    // Load the existing recipe data
    const loadRecipe = async () => {
        const token = getToken();
        if (!token) {
            alert("You are not logged in. Redirecting to login page.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/recipes/update/${id}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const recipe = await response.json();
                setRecipeName(recipe.recipe_name);
                setRecipeDescription(recipe.recipe_description);
                setRecipePrice(recipe.recipe_price);
                setRecipeImage(recipe.recipeImage);
            } else {
                alert("Failed to load recipe details. Redirecting to the recipes page.");
                navigate("/recipes");
            }
        } catch (error) {
            console.error("Error loading recipe details:", error);
            alert("A network error occurred. Redirecting to the recipes page.");
            navigate("/recipes");
        }
    };

    // Handle form submission for updating the recipe
    const handleUpdateRecipe = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) {
            alert("You are not logged in. Redirecting to login page.");
            navigate("/login");
            return;
        }

        const formData = new FormData();
        formData.append("recipe_name", recipeName);
        formData.append("recipe_description", recipeDescription);
        formData.append("recipe_price", recipe_price);

        if (recipeImage) {
            formData.append("recipe_image", recipeImage);
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/recipes/update/${id}/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert("Recipe updated successfully!");
                navigate("/recipes"); // Redirect to recipes page
            } else {
                alert("Failed to update recipe. Please check your input.");
            }
        } catch (error) {
            console.error("Error updating recipe:", error);
            alert("A network error occurred. Please try again.");
        }
    };

    // Load the recipe data on component mount
    useEffect(() => {
        loadRecipe();
    }, []);

    return (
        <div className="container mt-5">
            <form
                onSubmit={handleUpdateRecipe}
                className="col-6 mx-auto card p-3 shadow-lg"
            >
                <h2>Update Recipe</h2>
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
                    />
                </div>
                <button type="submit" className="btn btn-success">
                    Update Recipe
                </button>
            </form>
        </div>
    );
};

export default Update;
