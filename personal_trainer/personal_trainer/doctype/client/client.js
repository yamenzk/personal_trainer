// Copyright (c) 2024, YZ and contributors
// For license information, please see license.txt

frappe.ui.form.on('Client', {
    date_of_birth: function(frm) {
        if (frm.doc.date_of_birth) {
            const dob = new Date(frm.doc.date_of_birth);
            const age = new Date().getFullYear() - dob.getFullYear();
            frm.set_value('age', age);
        } else {
            frm.set_value('age', null);
        }
    },
    height: function(frm) {
        calculateTargets(frm);
    },
    gender: function(frm) {
        calculateTargets(frm);
    },
    weight_log: function(frm) {
        calculateTargets(frm);
    },
    goal: function(frm) {
        calculateTargets(frm);
    },
    multiplier: function(frm) {
        calculateTargets(frm);
    }
});

function calculateTargets(frm) {
    const height = frm.doc.height || 0;
    const gender = frm.doc.gender || 'Male';
    const multiplier = frm.doc.multiplier || 1;
    
    // Get last weight from weight_log child table
    let lastWeight = 70; // Default value
    if (frm.doc.weight_log && frm.doc.weight_log.length > 0) {
        lastWeight = frm.doc.weight_log[frm.doc.weight_log.length - 1].weight; // Assuming weight is a field in weight_log
    }

    const goal = frm.doc.goal || 'Weight Maintenance'; // Default goal

    // Calculate targets based on provided information
    let protein_target, carb_target, fat_target, energy_target, water_target;

    // Example calculation logic (customize as needed)
    if (goal === 'Weight Loss') {
        protein_target = lastWeight * 2.2 * 1.2 * multiplier; // g
        carb_target = lastWeight * 2.2 * 1.0 * multiplier; // g
        fat_target = lastWeight * 2.2 * 0.8 * multiplier; // g
    } else if (goal === 'Weight Gain') {
        protein_target = lastWeight * 2.2 * 1.6 * multiplier; // g
        carb_target = lastWeight * 2.2 * 1.5 * multiplier; // g
        fat_target = lastWeight * 2.2 * 0.9 * multiplier; // g
    } else {
        // Muscle Building or default
        protein_target = lastWeight * 2.2 * 1.5 * multiplier; // g
        carb_target = lastWeight * 2.2 * 1.2 * multiplier; // g
        fat_target = lastWeight * 2.2 * 1.0 * multiplier; // g
    }

    // Total Energy and Water targets
    energy_target = (protein_target * 4) + (carb_target * 4) + (fat_target * 9); // KCal
    water_target = lastWeight * 30; // mL (example)

    // Set the values in the form
    frm.set_value('protein_target', protein_target);
    frm.set_value('carb_target', carb_target);
    frm.set_value('fat_target', fat_target);
    frm.set_value('energy_target', energy_target);
    frm.set_value('water_target', water_target);

    // Update last updated timestamp
    frm.set_value('last_updated', frappe.datetime.now_datetime());
}
