<?php
  /**
  * Requires the "PHP Email Form" library
  * The "PHP Email Form" library is available only in the pro version of the template
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  * For more info and help: https://bootstrapmade.com/php-email-form/
  */

  // Simple contact form handler
  // Update the receiving email address below to your real address
  $receiving_email_address = 'hishamabdulla20@gmail.com';

  header('Content-Type: text/plain; charset=UTF-8');

  // Basic server-side validation and sanitization
  $name = isset($_POST['name']) ? trim($_POST['name']) : '';
  $email = isset($_POST['email']) ? trim($_POST['email']) : '';
  $subject = isset($_POST['subject']) ? trim($_POST['subject']) : 'New contact message';
  $message = isset($_POST['message']) ? trim($_POST['message']) : '';

  if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo 'Please fill in all required fields.';
    exit;
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Please provide a valid email address.';
    exit;
  }

  // Build email
  $email_subject = "[Portfolio Contact] " . $subject;
  $email_body = "Name: " . htmlspecialchars($name) . "\n";
  $email_body .= "Email: " . htmlspecialchars($email) . "\n\n";
  $email_body .= "Message:\n" . htmlspecialchars($message) . "\n";

  $headers = [];
  $headers[] = 'From: ' . $name . ' <' . $email . '>';
  $headers[] = 'Reply-To: ' . $email;
  $headers[] = 'MIME-Version: 1.0';
  $headers[] = 'Content-Type: text/plain; charset=UTF-8';

  // Try to send mail using PHP mail(). If unavailable on hosting, user can configure SMTP.
  $sent = false;
  try {
    $sent = mail($receiving_email_address, $email_subject, $email_body, implode("\r\n", $headers));
  } catch (Exception $e) {
    $sent = false;
  }

  if ($sent) {
    echo 'OK';
  } else {
    http_response_code(500);
    echo 'There was an error sending the message. Please try again later.';
  }
?>
