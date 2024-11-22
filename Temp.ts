$Outlook = New-Object -ComObject Outlook.Application
$Mail = $Outlook.CreateItem(0)

# Subject
$Mail.Subject = "Your Pre-designed Email Template"

# Rich HTML Content
$Mail.HTMLBody = @"
<div style="font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #2A9D8F;">Hello,</h1>
    <p>This is a <b>rich HTML email</b> template with styled text and an image:</p>
    <img src="https://via.placeholder.com/150" alt="Sample Image" style="margin: 10px 0;">
    <p>Thanks,<br>Your Team</p>
</div>
"@

$Mail.To = "recipient@example.com"
$Mail.Display()