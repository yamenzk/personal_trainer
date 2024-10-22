# Copyright (c) 2024, YZ and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import add_to_date, get_datetime, now_datetime

class Membership(Document):
    def before_save(self):
        # Update dates if document is new or subscription package has changed
        if self.is_new() or self.subscription_package != self.get_old_subscription_package():
            self.update_membership_dates()

        now = now_datetime()
        start = get_datetime(self.start)
        end = get_datetime(self.end)

        # Check if now is between start and end
        self.enabled = start <= now <= end if start and end else False

    def update_membership_dates(self):
        if self.subscription_package:
            package = frappe.get_doc('Subscription Package', self.subscription_package)
            duration = package.duration
            
            # Only set dates if duration is valid
            if duration:
                now = now_datetime()
                self.start = now
                self.end = add_to_date(now, seconds=duration)

    def get_old_subscription_package(self):
        # Fetch the previous subscription package before the current save
        if self.name:
            old_doc = frappe.get_doc(self.doctype, self.name)
            return old_doc.subscription_package
        return None
