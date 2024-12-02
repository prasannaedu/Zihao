from django.db import models
from django.contrib.auth.models import User

class Receipe(models.Model):
    user = models.ForeignKey(User ,on_delete =models.SET_NULL, null =True , blank =True)
    receipe_name = models.CharField(max_length=100)
    receipe_description = models.TextField()
    receipe_image = models.ImageField(upload_to="receipe")
    recipe_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # New field
    def __str__(self):
        return self.receipe_name