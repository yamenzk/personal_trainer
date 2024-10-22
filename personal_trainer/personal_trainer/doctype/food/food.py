# Copyright (c) 2024, YZ and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from personal_trainer.custom_methods import fetch_nutritional_info, fetch_image_url

class Food(Document):
    pass
    # def before_insert(self):
    #     frappe.log("Running before insert")
    #     # Only run if fdcid is present
    #     if not self.fdcid:
    #         frappe.log("Not found")
    #         return
        
    #     # Fetch nutritional information based on fdcid
    #     frappe.log("fetching")
    #     data = fetch_nutritional_info(self.fdcid)
        
    #     if data:
    #         # Set ingredient, description, and category from the fetched data
    #         self.ingredient = data['description'].split(',')[0].strip()
    #         self.description = data['description']
    #         self.category = data['foodCategory']['description']
    #         self.enabled = 1
            
    #         # Loop through nutrients and append to nutritional_facts
    #         for nutrient in data['foodNutrients']:
    #             if nutrient['type'] == 'FoodNutrient' and 'amount' in nutrient:
    #                 self.append('nutritional_facts', {
    #                     'nutrient': nutrient['nutrient']['name'],
    #                     'value': nutrient['amount'],
    #                     'unit': nutrient['nutrient']['unitName']
    #                 })
        
    #     # Fetch image URL based on ingredient name
    #     image_response = fetch_image_url(self.ingredient)
        
    #     # If image response is successful, update the image field
    #     if image_response:
    #         self.image = image_response