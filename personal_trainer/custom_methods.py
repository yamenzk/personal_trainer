import frappe
from frappe.utils import get_datetime

@frappe.whitelist(allow_guest=True)
def authenticate_membership(membership_id):
    membership = frappe.get_doc("Membership", membership_id)
    if membership and membership.enabled:
        client = frappe.get_doc("Client", membership.client).as_dict()
        membership_dict = membership.as_dict()  # Convert membership to dict
        return {
            "client": client,
            "membership": membership_dict
        }
    return None  # Optionally handle the case where membership is not valid

    
@frappe.whitelist(allow_guest=True)
def update_client_doc(client_id, field, value):
    try:
        # Fetch the Client document
        client_doc = frappe.get_doc("Client", client_id)
        
        # Check if the field is 'weight_log'
        if field == "weight_log":
            # Append a new entry to the child table with the current date and weight
            client_doc.append("weight_log", {
                "weight": float(value)  # Provided weight
            })
        else:
            # Update the specified field with the new value
            setattr(client_doc, field, value)
        
        # Save the document and ignore permissions
        client_doc.save(ignore_permissions=True)
        frappe.db.commit()
        return "Client document updated successfully."
    
    except frappe.DoesNotExistError:
        return "Client not found."
    except Exception as e:
        return "An error occurred: {0}".format(str(e))