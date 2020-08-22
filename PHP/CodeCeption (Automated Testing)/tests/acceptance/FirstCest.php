<?php 
use \Codeception\Util\Locator;

class FirstCest
{
    private $constants;

    public function _before(AcceptanceTester $I)
    {
        $this->constants["login"] = array("email" => "mustafa@gmail.com", "password" => "qweqwe123");
        $this->constants["register"] = array("fullname" => "Saddam Husain", "email" => "tony@stark61.com", "password" => "123456", "phone" => "9876543210");
        $this->constants["address"] = array("street_name" => "#123 Street 1", "floor" => "First Floor", "unit_number" => "UN1234", "po_box" => "PO1234", "city_id" => 1, "city_name" => "copenhagen");
        $this->constants["other_address"] = array("street_name" => "#321 Street", "floor" => "Second Floor", "unit_number" => "UN1234", "po_box" => "PO1234", "city_id" => 1, "city_name" => "copenhagen");
        $this->constants["payment"] = array("card_number" => "4571100000000000", "expiry_month" => "06", "expiry_year" => "24", "cvc" => 684);
        $this->constants["other_payment"] = array("card_number" => "5100100000000000", "expiry_month" => "06", "expiry_year" => "24", "cvc" => 684);
    }

    /* Auth Tests */
    private function login(AcceptanceTester $I) {
        $I->amOnPage('/');
        $I->click("a[data-type='login']");
        $I->wait(1);

        $I->see("login or register");

        $I->fillField("#login input[name='email']", $this->constants["login"]["email"]);
        $I->fillField("#login input[name='password']", $this->constants["login"]["password"]);
        
        //click submit
        $I->click("#login-btn");
        $I->wait(15);
        $I->see('Logout');
        //see PICKUP MY LAUNDRY
    }

    private function register(AcceptanceTester $I) {
        $I->amOnPage('/');
        $I->click("a[data-type='register']");
        $I->wait(1);

        $I->fillField("#register input[name='fullname']", $this->constants["register"]["fullname"]);
        $I->fillField("#register input[name='email']", $this->constants["register"]["email"]);
        $I->fillField("#register input[name='password']", $this->constants["register"]["password"]);
        $I->fillField("#register input[name='phone']", $this->constants["register"]["phone"]);
        
        //click submit
        $I->click("#register-btn");
        $I->wait(15);
        $I->see('Logout');
    }

    private function forgot_password(AcceptanceTester $I) {
        $I->amOnPage('/');
        $I->click("a[data-type='login']");
        $I->wait(1);

        $I->see("login or register");
        $I->click('#forgot-pwd-link');

        $I->wait(1);
        $I->see("Forgot Password");   

        $I->fillField('#forgotPassword input[name="email"]', $this->constants["login"]["email"]);
        
        //click submit
        $I->click("#forgot-pwd");
        $I->waitForElementNotVisible('.alert-success', 10);
        $I->wait(5);
    }
    /* End of Auth Tests  */


    /* Order Creation Tests for Logged Out User */
    private function order_creation_for_guest(AcceptanceTester $I) {
        $I->amOnPage('/');
        $I->click('a[data-target="#requestPickupModal"]');
        $I->wait(10);

        $I->seeElement('section[wz-heading-title="PartialUserDetail"]');

        $I->fillField('section[wz-heading-title="PartialUserDetail"] input[name="fullname"]', $this->constants["register"]["fullname"]);
        $I->fillField('section[wz-heading-title="PartialUserDetail"] input[name="phone"]', $this->constants["register"]["phone"]);
        $option = $I->grabTextFrom('section[wz-heading-title="PartialUserDetail"] select option[value="'.$this->constants["address"]["city_id"].'"]');
        $I->selectOption('section[wz-heading-title="PartialUserDetail"] select', $option); 
        $I->seeOptionIsSelected('section[wz-heading-title="PartialUserDetail"] select',  $this->constants["address"]["city_name"]);

        /*click submit */
        $I->click('section[wz-heading-title="PartialUserDetail"] .action-btn');

        $I->waitForElementVisible('section[wz-heading-title="PickupDate"]', 10); // secs
        $I->wait(5);

        /*Pickup Date */
        $I->click('section[wz-heading-title="PickupDate"]>.row:nth-child(2)');
        $I->waitForElement('section[wz-heading-title="PickupTime"]', 10); // secs

        /*Pickup Time */
        $I->click('section[wz-heading-title="PickupTime"] #div_slots > .row');
        $I->waitForElementVisible('section[wz-heading-title="DropDate"]', 10); // secs

        /*Drop Date */
        $I->click('section[wz-heading-title="DropDate"] > .row:nth-child(2)');
        $I->waitForElementVisible('section[wz-heading-title="DropTime"]', 10); // secs

        /*Drop Time */
        $I->click('section[wz-heading-title="DropTime"] #div_slots > .row');
        $I->waitForElementVisible('section[wz-heading-title="UserDetail"]', 10); // secs
        
        $I->fillField('section[wz-heading-title="UserDetail"] input[name="email"]', $this->constants["register"]["email"].rand(10, 100));
        $I->fillField('section[wz-heading-title="UserDetail"] input[name="password"]', $this->constants["register"]["password"]);

        /*click submit */
        $I->click('section[wz-heading-title="UserDetail"] .action-btn:nth-child(2)');
        $I->waitForElementVisible('section[wz-heading-title="AddressDetail"]', 10); // secs


        /* Test Address Step */
        $this->testAddressStep($I, $this->constants["address"]);
        $I->waitForElementVisible('section[wz-heading-title="PaymentDetail"]', 10); // secs
        
        /* Test Payment Step */
        $this->testPaymentStep($I, $this->constants["payment"]);

        $I->waitForElementVisible('section[wz-heading-title="OrderSummary"]', 10); // secs

        $I->click('section[wz-heading-title="OrderSummary"] button[type="submit"]');
        $I->waitForElementVisible('.other-content', 10); // secs
        $I->wait(10);
    }

    private function order_creation_for_guest_with_two_addresses(AcceptanceTester $I) {
        $I->amOnPage('/');
        $I->click('a[data-target="#requestPickupModal"]');
        $I->wait(10);

        $I->seeElement('section[wz-heading-title="PartialUserDetail"]');

        $I->fillField('section[wz-heading-title="PartialUserDetail"] input[name="fullname"]', $this->constants["register"]["fullname"]);
        $I->fillField('section[wz-heading-title="PartialUserDetail"] input[name="phone"]', $this->constants["register"]["phone"]);
        $option = $I->grabTextFrom('section[wz-heading-title="PartialUserDetail"] select option[value="'.$this->constants["address"]["city_id"].'"]');
        $I->selectOption('section[wz-heading-title="PartialUserDetail"] select', $option); 
        $I->seeOptionIsSelected('section[wz-heading-title="PartialUserDetail"] select',  $this->constants["address"]["city_name"]);

        /* click submit */
        $I->click('section[wz-heading-title="PartialUserDetail"] .action-btn');

        $I->waitForElementVisible('section[wz-heading-title="PickupDate"]', 10); // secs
        $I->wait(5);

        /* Pickup Date */
        $I->click('section[wz-heading-title="PickupDate"]>.row:nth-child(2)');
        $I->waitForElement('section[wz-heading-title="PickupTime"]', 10); // secs

        /* Pickup Time */
        $I->click('section[wz-heading-title="PickupTime"] #div_slots > .row');
        $I->waitForElementVisible('section[wz-heading-title="DropDate"]', 10); // secs

        /* Drop Date */
        $I->click('section[wz-heading-title="DropDate"]>.row:nth-child(2)');
        $I->waitForElementVisible('section[wz-heading-title="DropTime"]', 10); // secs

        /* Drop Time */
        $I->click('section[wz-heading-title="DropTime"] #div_slots > .row');
        $I->waitForElementVisible('section[wz-heading-title="UserDetail"]', 10); // secs
        
        $I->fillField('section[wz-heading-title="UserDetail"] input[name="email"]', $this->constants["register"]["email"].rand(10, 100));
        $I->fillField('section[wz-heading-title="UserDetail"] input[name="password"]', $this->constants["register"]["password"]);

        /* click submit */
        $I->click('section[wz-heading-title="UserDetail"] .action-btn:nth-child(2)');
        $I->waitForElementVisible('section[wz-heading-title="AddressDetail"]', 10); // secs


        /* Test Address Step */
        $this->testAddressStep($I, $this->constants["address"]);
        $I->waitForElementVisible('section[wz-heading-title="PaymentDetail"]', 10); // secs
        
        /* Test Payment Step */
        $this->testPaymentStep($I, $this->constants["payment"]);

        $I->waitForElementVisible('section[wz-heading-title="OrderSummary"]', 10); // secs
        
        /* Again click on Add Address Button */
        $this->testOrderSummaryAddress($I, $this->constants["other_address"]);

        $I->wait(10);

        $I->see($this->constants["other_address"]["street_name"]);     

        $I->click('section[wz-heading-title="OrderSummary"] button[type="submit"]');
        $I->waitForElementVisible('.other-content', 10); // secs
        $I->wait(10);
    }

    private function order_creation_for_guest_with_two_payments(AcceptanceTester $I) {
        $I->amOnPage('/');
        $I->click('a[data-target="#requestPickupModal"]');
        $I->wait(10);

        $I->seeElement('section[wz-heading-title="PartialUserDetail"]');

        $I->fillField('section[wz-heading-title="PartialUserDetail"] input[name="fullname"]', $this->constants["register"]["fullname"]);
        $I->fillField('section[wz-heading-title="PartialUserDetail"] input[name="phone"]', $this->constants["register"]["phone"]);
        $option = $I->grabTextFrom('section[wz-heading-title="PartialUserDetail"] select option[value="'.$this->constants["address"]["city_id"].'"]');
        $I->selectOption('section[wz-heading-title="PartialUserDetail"] select', $option); 
        $I->seeOptionIsSelected('section[wz-heading-title="PartialUserDetail"] select',  $this->constants["address"]["city_name"]);

        /* click submit */
        $I->click('section[wz-heading-title="PartialUserDetail"] .action-btn');

        $I->waitForElementVisible('section[wz-heading-title="PickupDate"]', 10); // secs
        $I->wait(5);

        /* Pickup Date */
        $I->click('section[wz-heading-title="PickupDate"]>.row:nth-child(2)');
        $I->waitForElement('section[wz-heading-title="PickupTime"]', 10); // secs

        /* Pickup Time */
        $I->click('section[wz-heading-title="PickupTime"] #div_slots > .row');
        $I->waitForElementVisible('section[wz-heading-title="DropDate"]', 10); // secs

        /* Drop Date */
        $I->click('section[wz-heading-title="DropDate"]>.row:nth-child(2)');
        $I->waitForElementVisible('section[wz-heading-title="DropTime"]', 10); // secs

        /* Drop Time */
        $I->click('section[wz-heading-title="DropTime"] #div_slots > .row');
        $I->waitForElementVisible('section[wz-heading-title="UserDetail"]', 10); // secs
        
        $I->fillField('section[wz-heading-title="UserDetail"] input[name="email"]', $this->constants["register"]["email"].rand(10, 100));
        $I->fillField('section[wz-heading-title="UserDetail"] input[name="password"]', $this->constants["register"]["password"]);

        /* click submit */
        $I->click('section[wz-heading-title="UserDetail"] .action-btn:nth-child(2)');
        $I->waitForElementVisible('section[wz-heading-title="AddressDetail"]', 10); // secs


        /* Test Address Step */
        $this->testAddressStep($I, $this->constants["address"]);
        $I->waitForElementVisible('section[wz-heading-title="PaymentDetail"]', 10); // secs
        
        /* Test Payment Step */
        $this->testPaymentStep($I, $this->constants["payment"]);

        $I->waitForElementVisible('section[wz-heading-title="OrderSummary"]', 10); // secs
        
        /* Again click on Add Payment Button */
        $this->testOrderSummaryPayment($I, $this->constants["other_payment"]);   

        $I->click('section[wz-heading-title="OrderSummary"] button[type="submit"]');
        $I->waitForElementVisible('.other-content', 10); // secs
        $I->wait(10);
    }
    /* End of Order Creation Tests for Logged Out User */

    /* Order Creation Tests for Logged In User */
    private function order_creation_for_user(AcceptanceTester $I) {
        $I->amOnPage('/');
        
        $this->login($I);

        $I->click('a[data-target="#requestPickupModal"]');
        $I->wait(10);

        /* Pickup Date */
        $I->click('section[wz-heading-title="PickupDate"] > .row:nth-child(2)');
        $I->waitForElement('section[wz-heading-title="PickupTime"]', 10); // secs

        /*Pickup Time */
        $I->click('section[wz-heading-title="PickupTime"] #div_slots > .row');
        $I->waitForElementVisible('section[wz-heading-title="DropDate"]', 10); // secs

        /*Drop Date */
        $I->click('section[wz-heading-title="DropDate"] > .row:nth-child(2)');
        $I->waitForElementVisible('section[wz-heading-title="DropTime"]', 10); // secs

        /*Drop Time */
        $I->click('section[wz-heading-title="DropTime"] #div_slots > .row');

        /*Check for address */
        try {
            $I->waitForElementVisible('section[wz-heading-title="AddressDetail"]', 10); // secs
            
            /*Test Address Step */
            $this->testAddressStep($I, $this->constants["address"]);
        } catch (Exception $e) {
            
        }

        /*Check for payment */
        try {
            $I->waitForElementVisible('section[wz-heading-title="PaymentDetail"]', 10); // secs
            
            /*Test Payment Step */
            $this->testPaymentStep($I, $this->constants["payment"]);
        } catch (Exception $e) {

        }

        $I->waitForElementVisible('section[wz-heading-title="OrderSummary"]', 15); // secs

        $I->click('section[wz-heading-title="OrderSummary"] button[type="submit"]');
        $I->waitForElementVisible('.other-content', 10); // secs
        $I->wait(10);
    }

    public function order_creation_for_user_with_two_addresses(AcceptanceTester $I) {
        $I->amOnPage('/');
        
        $this->login($I);

        $I->click('a[data-target="#requestPickupModal"]');
        $I->wait(10);

        /* Pickup Date */
        $I->click('section[wz-heading-title="PickupDate"] > .row:nth-child(2)');
        $I->waitForElement('section[wz-heading-title="PickupTime"]', 10); // secs

        /* Pickup Time */
        $I->click('section[wz-heading-title="PickupTime"] #div_slots > .row');
        $I->waitForElementVisible('section[wz-heading-title="DropDate"]', 10); // secs

        /* Drop Date */
        $I->click('section[wz-heading-title="DropDate"] > .row:nth-child(2)');
        $I->waitForElementVisible('section[wz-heading-title="DropTime"]', 10); // secs

        /* Drop Time */
        $I->click('section[wz-heading-title="DropTime"] #div_slots > .row');

        /* Check for address */
        try {
            $I->waitForElementVisible('section[wz-heading-title="AddressDetail"]', 10); // secs
            
            /*  Test Address Step */
            $this->testAddressStep($I, $this->constants["address"]);
        } catch (Exception $e) {
            
        }

        /* Check for payment */
        try {
            $I->waitForElementVisible('section[wz-heading-title="PaymentDetail"]', 10); // secs
            
            /*  Test Payment Step */
            $this->testPaymentStep($I, $this->constants["payment"]);
        } catch (Exception $e) {

        }

        $I->waitForElementVisible('section[wz-heading-title="OrderSummary"]', 15); // secs

        /* Again click on Add Address Button */
        $this->testOrderSummaryAddress($I, $this->constants["other_address"]);

        $I->click('section[wz-heading-title="OrderSummary"] button[type="submit"]');
        $I->waitForElementVisible('.other-content', 10); // secs
        $I->wait(10);
    }

    private function order_creation_for_user_with_two_payments(AcceptanceTester $I) {
        $I->amOnPage('/');
        
        $this->login($I);

        $I->click('a[data-target="#requestPickupModal"]');
        $I->wait(10);

        ////Pickup Date
        $I->click('section[wz-heading-title="PickupDate"]>.row:nth-child(2)');
        $I->waitForElement('section[wz-heading-title="PickupTime"]', 10); // secs

        ////Pickup Time
        $I->click('section[wz-heading-title="PickupTime"] #div_slots > .row');
        $I->waitForElementVisible('section[wz-heading-title="DropDate"]', 10); // secs

        ////Drop Date
        $I->click('section[wz-heading-title="DropDate"]>.row:nth-child(2)');
        $I->waitForElementVisible('section[wz-heading-title="DropTime"]', 10); // secs

       //// Drop Time
        $I->click('section[wz-heading-title="DropTime"] #div_slots > .row');

        ////Check for address
        try {
            $I->waitForElementVisible('section[wz-heading-title="AddressDetail"]', 10); // secs
            
            ////Test Address Step
            $this->testAddressStep($I, $this->constants["address"]);
        } catch (Exception $e) {
            
        }

        ////Check for payment
        try {
            $I->waitForElementVisible('section[wz-heading-title="PaymentDetail"]', 10); // secs
            
            ////Test Payment Step
            $this->testPaymentStep($I, $this->constants["payment"]);
        } catch (Exception $e) {

        }

        $I->waitForElementVisible('section[wz-heading-title="OrderSummary"]', 15); // secs

        ////Again click on Add Payment Button
        $this->testOrderSummaryPayment($I, $this->constants["other_payment"]);

        $I->click('section[wz-heading-title="OrderSummary"] button[type="submit"]');
        $I->waitForElementVisible('.other-content', 10); // secs
        $I->wait(10);
    }
    /* End of Order Creation Tests for Logged In User */

    /* Common Functions for Tests */
    private function testPaymentStep(AcceptanceTester $I, $data, $payemnt_index = 1) {
        $I->wait(5);
        $I->switchToIFrame('paymentIframe');
        $I->waitForElement('#payment form[name="paytype"]:nth-child('. $payemnt_index .')', 10);
        $I->click('#payment form[name="paytype"]:nth-child('. $payemnt_index .')');
        $I->wait(10);
        $I->see("Validate payment");

        $I->fillField('input[name="cardno"]', $data["card_number"]);
        $I->fillField('input[name="expmon"]', $data["expiry_month"]);
        $I->fillField('input[name="expyear"]', $data["expiry_year"]);
        $I->fillField('input[name="cvc"]', $data["cvc"]);
        $I->click('#btnAuthSubmit');
        $I->wait(10);
        $I->switchToIFrame();
    }

    private function testAddressStep(AcceptanceTester $I, $data) {
        $I->fillField('section[wz-heading-title="AddressDetail"] input[name="street_name"]', $data["street_name"]);
        $I->fillField('section[wz-heading-title="AddressDetail"] input[name="floor"]', $data["floor"]);
        $I->fillField('section[wz-heading-title="AddressDetail"] input[name="unit_number"]', $data["unit_number"]);
        $I->fillField('section[wz-heading-title="AddressDetail"] input[name="pobox"]', $data["po_box"]);
        $option = $I->grabTextFrom('section[wz-heading-title="AddressDetail"]  select option[value="'.$data["city_id"].'"]');
        $I->selectOption('section[wz-heading-title="AddressDetail"]  select', $option); 
        $I->seeOptionIsSelected('section[wz-heading-title="AddressDetail"]  select', $data["city_name"]);
        
        //click submit
        $I->click('section[wz-heading-title="AddressDetail"] .action-btn:nth-child(2)');
    }

    private function testOrderSummaryAddress(AcceptanceTester $I, $data) {
        $I->click('.address-card .small-fixed-width-btn');

        $I->see('Change Address');
        $I->executeJS("jQuery('#addressChangeModal .round_button.action-btn').click()");
        $I->click("#addressChangeModal .round_button.action-btn");

        $I->wait(5);

        $I->see('Add Address');

        $I->fillField('#addressAddModal input[name="street_name"]', $data["street_name"]);
        $I->fillField('#addressAddModal input[name="floor"]', $data["floor"]);
        $I->fillField('#addressAddModal input[name="unit_number"]', $data["unit_number"]);
        $I->fillField('#addressAddModal input[name="pobox"]', $data["po_box"]);
        $option = $I->grabTextFrom('#addressAddModal  select option[value="'.$data["city_id"].'"]');
        $I->selectOption('#addressAddModal  select', $option); 
        $I->seeOptionIsSelected('#addressAddModal  select', $data["city_name"]);
        
        //click submit
        $I->click('#addressAddModal .action-btn');
    }

    private function testOrderSummaryPayment(AcceptanceTester $I, $data) {
        $I->click('.vault-card .small-fixed-width-btn');
        
        $I->wait(5);

        try {
            $I->see('Change Payment Method');
            $I->click("#vaultChangeModal .round_button.action-btn");
        } catch (Exception $e) {
            
        }
        
        $I->wait(5);

        $I->see('Add Payment Method');

        $this->testPaymentStep($I, $data, 5);

        $I->wait(10);

        $I->see(substr($data["card_number"], -4));  
    }
    /* End of Common Functions for Tests */
}
