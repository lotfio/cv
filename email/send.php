<?php

/**
 * just a quick stupid email sender
 */
if(isset($_POST))
{

	//check if its an ajax request, exit if not
	if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) OR strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest')
	{
		$output = json_encode(array( //create JSON data
			'type' => 'error',
			'text' => 'Sorry Request must be Ajax POST'
		));
		die($output); //exit script outputting json data
	}

	//Sanitize input data using PHP filter_var().
	$sender_name        = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
	$message_content    = filter_var($_POST["content"], FILTER_SANITIZE_STRING);
	$sender_email       = $_POST["email"];

	//additional php validation
	if(strlen($message_content) < 3 ) //check empty message
	{
		$output = json_encode(array('type'=>'error_message_content', 'text' => 'Message content is too short.'));
		die($output);
	}
	if(strlen($sender_name) < 3 ) // If length is less than 3 it will output JSON error.
	{
		$output = json_encode(array('type'=>'error_sender_name', 'text' => 'Provided name is too short.'));
		die($output);
	}
	if(filter_var($sender_email, FILTER_VALIDATE_EMAIL) === false) //email validation
	{
		$output = json_encode(array('type'=>'error_sender_email', 'text' => 'E-mail format is incorrect.'));
		die($output);
	}


	/*------------------------------------*\
		E-mail send
	\*------------------------------------*/

	//Recipient email, Replace with own email here
	$to_email = "contact@lotfio.net";

	//email headers
	$headers  = "Content-type: text/html; charset=utf-8" . "\r\n";
	$headers .= "Reply-To: " . $sender_email . "\r\n";
	$headers .= "X-Mailer: PHP/" . phpversion();

	//email subject
	$message_subject = "You've got mail! From " . $sender_name . ".";

	//email content
	$message_body  = "<b>Sender:</b> \r\n <br>" . $sender_name . " &lt;" . $sender_email . "&gt;\r\n\r\n <br><br>";
	$message_body .= "<b>Message:</b> \r\n <br>" . $message_content;

	//send mail function
	$send_mail = mail($to_email, $message_subject, $message_body, $headers);

	/*------------------------------------*\
		E-mail status
	\*------------------------------------*/

	//If mail couldn't be sent output error. Check your PHP email configuration.
	if(!$send_mail)
	{
		$output = json_encode(array('type'=>'error', 'text' => 'There was an error while sending the message.'));
		die($output);
	}
	else
	{
		$output = json_encode(array('type'=>'message', 'text' => 'Thanks ' . $sender_name . ' for your message, <br> I will reply as fast as I can.'));
		die($output);
	}

}
