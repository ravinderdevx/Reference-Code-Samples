<?php
namespace App\Helpers;

use \DrewM\MailChimp\MailChimp;

use App\Helpers\OptionHelper;

class MailChimpHelper
{	
    private $MailChimp;

    public function __construct($apiKey)
	{	
		$this->MailChimp = new MailChimp($apiKey);
    }

    public function addMemberToList($list_id, $email, $merge_fields = [], $status = 'subscribed') {
        return $this->MailChimp->post("lists/$list_id/members", [
            'email_address' => $email,
            'status'        => $status,
            'merge_fields' => $merge_fields
        ]);
    }
}