// Default email templates (18 categories). Editable by admin; SMTP wired later.
export interface TemplateSeed { key: string; category: string; subject: string; body: string }

export const EMAIL_TEMPLATES: TemplateSeed[] = [
  { key: "lead_received", category: "Lead Received", subject: "We received your inquiry — TestPsychometric",
    body: "Dear {Name},\n\nThank you for your inquiry on TestPsychometric.com. Our team will contact you shortly.\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "lead_assigned", category: "Lead Assigned", subject: "A lead has been assigned to you",
    body: "Hi {AssignedTo},\n\nLead {Name} ({Phone}) has been assigned to you. Please follow up.\n\nRegards,\nTestPsychometric" },
  { key: "lead_followup", category: "Lead Follow-up", subject: "Following up on your inquiry",
    body: "Dear {Name},\n\nWe are following up on your recent inquiry. Please let us know how we can help.\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "account_approved", category: "Account Approved", subject: "Your account has been approved",
    body: "Dear {Name},\n\nYour account on TestPsychometric.com has been approved and is now active.\n\nLogin: {LoginURL}\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "account_rejected", category: "Account Rejected", subject: "Update on your application",
    body: "Dear {Name},\n\nWe regret to inform you that your application could not be approved at this time.\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "school_created", category: "School Account Created", subject: "Your School Account Has Been Created",
    body: "Dear {Name},\n\nYour school account has been created on TestPsychometric.com.\n\nLogin URL: {LoginURL}\nUsername: {Username}\nTemporary Password: {Password}\n\nPlease change your password after first login.\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "company_created", category: "Company Account Created", subject: "Your Company Account Has Been Created",
    body: "Dear {Name},\n\nYour account has been successfully created on TestPsychometric.com.\n\nLogin URL: {LoginURL}\nUsername: {Username}\nTemporary Password: {Password}\n\nPlease change your password after first login.\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "centre_created", category: "Study Centre Account Created", subject: "Your Study Centre Account Has Been Created",
    body: "Dear {Name},\n\nYour Authorised Study Centre account has been created on TestPsychometric.com.\n\nLogin URL: {LoginURL}\nUsername: {Username}\nTemporary Password: {Password}\n\nPlease change your password after first login.\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "individual_created", category: "Individual User Account Created", subject: "Your Account Has Been Created",
    body: "Dear {Name},\n\nYour account has been created on TestPsychometric.com.\n\nLogin URL: {LoginURL}\nUsername (email): {Username}\nTemporary Password: {Password}\n\nPlease change your password after first login.\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "password_reset", category: "Password Reset", subject: "Your password has been reset",
    body: "Dear {Name},\n\nYour password has been reset.\n\nTemporary Password: {Password}\n\nPlease change it after logging in.\n\nRegards,\nTestPsychometric" },
  { key: "payment_pending", category: "Payment Pending", subject: "Your payment is pending verification",
    body: "Dear {Name},\n\nWe have received your payment details of ₹{Amount} and they are pending verification. You will be notified once approved.\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "payment_verified", category: "Payment Verified", subject: "Your payment has been verified",
    body: "Dear {Name},\n\nYour payment of ₹{Amount} has been verified and your account is now active.\nReceipt No: {ReceiptNo}\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "test_completed", category: "Test Completed", subject: "Assessment completed",
    body: "Dear {Name},\n\nThe assessment for {Student} has been completed and the report is ready.\n\nRegards,\nTestPsychometric" },
  { key: "report_generated", category: "Report Generated", subject: "Your report is ready",
    body: "Dear {Name},\n\nThe psychometric report for {Student} has been generated and is available to download from your dashboard.\n\nRegards,\nTestPsychometric" },
  { key: "settlement_approved", category: "Settlement Approved", subject: "Your settlement has been processed",
    body: "Dear {Name},\n\nYour settlement of ₹{Amount} has been processed.\nReference: {Reference}\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "settlement_rejected", category: "Settlement Rejected", subject: "Update on your settlement request",
    body: "Dear {Name},\n\nYour settlement request of ₹{Amount} could not be processed.\nRemarks: {Remarks}\n\nRegards,\nAMG Educational Charitable Society" },
  { key: "new_notification", category: "New Notification", subject: "You have a new notification",
    body: "Dear {Name},\n\n{Message}\n\nRegards,\nTestPsychometric" },
  { key: "admin_message", category: "Admin Message", subject: "{Subject}",
    body: "Dear {Name},\n\n{Message}\n\nRegards,\nAMG Educational Charitable Society" },
];

export function renderTemplate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}
