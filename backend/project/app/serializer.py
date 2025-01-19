from rest_framework import serializers
from .models import *




class JerseySerializer(serializers.ModelSerializer):
    class Meta:
        model=Jersey
        fields='__all__'
        
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['jersey', 'quantity']
        read_only_fields = ['item_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)  # Nested serializer for order items

    class Meta:
        model = Order
        fields = ['email', 'First_Name', 'Last_Name', 'address','phone', 'total_price', 'status','payment_method', 'items']
        read_only_fields = ['total_price', 'status']  # These will be calculated, so they're read-only

    def create(self, validated_data):
        items_data = validated_data.pop('items')
       
        total_price = sum(
            item_data['jersey'].price * item_data['quantity'] for item_data in items_data
        )

       
        order = Order.objects.create(total_price=total_price, **validated_data)

        total_price = 0
        for item_data in items_data:
            jersey = item_data['jersey']
            quantity = item_data['quantity']

            if jersey.quantity < quantity:
                raise serializers.ValidationError(
                    f"Not enough stock for {jersey.name}. Requested: {quantity}, Available: {jersey.quantity}"
                )

           
            jersey.quantity -= quantity
            jersey.save()

           
            item_price = jersey.price * quantity
            OrderItem.objects.create(order=order, jersey=jersey, quantity=quantity, item_price=item_price)

            total_price += item_price

        order.total_price = total_price
        order.save()

        return order