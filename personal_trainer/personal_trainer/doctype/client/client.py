# Copyright (c) 2024, YZ and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from datetime import datetime

class Client(Document):
    def validate(self):
        self.calculate_age()
        self.calculate_targets()

    def calculate_age(self):
        if self.date_of_birth:
            dob = frappe.utils.getdate(self.date_of_birth)
            age = (frappe.utils.getdate() - dob).days // 365  # Age in years
            self.age = age

    def calculate_targets(self):
        height = self.height or 0
        gender = self.gender or 'Male'
        multiplier = self.multiplier or 1
        
        # Get last weight from weight_log child table
        last_weight = 70  # Default value
        if self.weight_log:
            last_weight = self.weight_log[-1].weight  # Assuming weight is a field in weight_log

        goal = self.goal or 'Weight Maintenance'  # Default goal

        # Example calculation logic (customize as needed)
        if goal == 'Weight Loss':
            protein_target = last_weight * 2.2 * 1.2 * multiplier
            carb_target = last_weight * 2.2 * 1.0 * multiplier
            fat_target = last_weight * 2.2 * 0.8 * multiplier
        elif goal == 'Weight Gain':
            protein_target = last_weight * 2.2 * 1.6 * multiplier
            carb_target = last_weight * 2.2 * 1.5 * multiplier
            fat_target = last_weight * 2.2 * 0.9 * multiplier
        else:  # Muscle Building or default
            protein_target = last_weight * 2.2 * 1.5 * multiplier
            carb_target = last_weight * 2.2 * 1.2 * multiplier
            fat_target = last_weight * 2.2 * 1.0 * multiplier

        # Total Energy and Water targets
        energy_target = (protein_target * 4) + (carb_target * 4) + (fat_target * 9)
        water_target = last_weight * 30  # mL (example)

        # Set the values in the document
        self.protein_target = protein_target
        self.carb_target = carb_target
        self.fat_target = fat_target
        self.energy_target = energy_target
        self.water_target = water_target

        # Update last updated timestamp
        self.last_updated = datetime.now()
