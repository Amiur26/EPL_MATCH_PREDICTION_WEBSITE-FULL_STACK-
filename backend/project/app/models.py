from django.db import models
import os



class Jersey(models.Model):

   
    name=models.CharField(max_length=250)
    price=models.DecimalField(max_digits=10,decimal_places=2)
    size=models.CharField(max_length=5)
    in_stock=models.BooleanField(True)
    quantity=models.PositiveIntegerField(default=0)
    image=models.ImageField(upload_to='jersey_images/')



    def __str__(self):
         return f"{self.name} - {self.size} - {self.price}bdt"
    
    def is_in_stock(self):
        return self.quantity>0
    
    def reduce_stock(self,quantity):
        """Reduces stock quantity if there is enough stock."""
        if self.quantity>=quantity:
           self.quantity-=quantity
           if self.quantity==0:
               self.in_stock=False
           self.save()
           return True
        else:
            return False
    
class Order(models.Model):

    PAYMENT_METHOD_CHOICES=[('online','Online Payment'),('cod','Cash on Delivery')]
    
    email = models.EmailField()
    First_Name = models.CharField(max_length=100)
    Last_Name = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=15)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending') 
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES, default='cod')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    def __str__(self):
        return f"Order {self.id} - {self.status}-{self.payment_method}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    jersey = models.ForeignKey(Jersey, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    item_price = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        
     self.item_price = self.jersey.price * self.quantity
     super().save(*args, **kwargs)


