angular.module('localization', [])
  .provider('$localization',
    function () {
      this.en_US = {
        server: {
          error: {
            500: {
              1001: 'Incorrect password. Ex: Abc123456!',
              1002: 'This username already exists in our system. Please enter a unique username.',
              1003: 'This email already exists in our system. Please enter a unique email.',
              1004: 'Check your phone'
            },
            409: {
              username: 'This username already exists in our system. Please enter a unique username.',
              email: 'This email already exists in our system. Please enter a unique email.',
              customerId: 'This ID already exists in our system',
              password: 'Password cannot same with previous password.',
              date: 'The start registration date must be before the end registration date.',
              dateLimit: 'The birthday of participant must from 01/01/1900 to 01/01/2005',
              dateEmpty: 'Please fill start/end date registration.'
            },
            0: 'Request timeout',
            9999: {
              dateInvalid: 'The date field is invalid.',
              benefitYearInvalid: 'You can not edit this benefit.',
            },
          },
          exception: 'There was a problem with authenticating: {{exception}}',
          questionSecurity : {
            validation : 'Please completed the security question.',
            success: 'You have successfully updated your security questions'
          }
        },
        alert: {
          waring: {
            heading: 'Warning!'
          },
          failure: {
            heading: 'Failure'
          }
        },
        placeholder: {
          username: 'User Name',
          lastName: 'Last Name',
          dateOfBirth: 'Date Of Birth',
          ssn: 'Last Four of Social Security #',
          from: 'From',
          to: 'To'
        },
        buttons: {
          remove: 'Remove',
          edit: 'Edit'        
        },
        tooltip: {
          password: '' +
          '<div class="title">A strong password</div>' +
          '<ul>' +
          '   <li>Is at least eight characters long.</li>' +
          '   <li>Not contain your user name, real name, or company name.</li>' +
          '   <li>Contain 1 capital letter</li>' +
          '   <li>Contain 1 number</li>' +
          '   <li>Contain 1 special character</li>' +
          '   <li>Passwords match</li>' +
          '</ul>'
        },
        password: {
             oldPassword: 'Please fill your old password'
        },
        login: {
          reason: {
            notAuthorized: 'You do not have enough permissions to do this. Please contact your administrator.',
            sessionExpired: 'Your session has expired. Please login again.',
            userExpired: 'You are not assigned to a company, please contact your company administrator.',
            notAuthenticated: 'Session expired. Please login to access your account.'
          },
          error: {
            invalidCredentials: 'The username and password combination are incorrect.',
            inactiveUser: 'Your account is suspended. Please contact your administrator.',
            serverError: 'There was a problem with authenticating: {{exception}}.'
          }
        },
        forgot: {
          username: {
            invalid: 'Please enter the Valid email address format.',
            error: 'Please enter a correct email.',
            500: 'Error while sending email to contact.'
          }
        },
        findAccount: {
          notFound: 'Your entry did not return a match in our system. Please try again.',
          notUpdate: 'User cannot update in this time',
          already: 'You have already created an account. Please login with your username and password.',
          existing: 'Your account has already been created. Please login to access your account.'
        },
        username: {
          success: 'Your account has been created. Please login to access your account.'
        },
        security: {
          reason: {
            email: 'Your entry did not return a match in our system. Please try again.',
            username: 'Your entry did not return a match in our system. Please try again.',
            question: 'Answer is incorrect'
          }
        },
        contact: {
          alert: {
            success: {
              title: 'Thank you for your submission',
              text: 'We will respond to you as quickly as possible. If you have further questions you may also call 1-866-222-0102'
            }
          }
        },
        profile: {
          message: {
            success: 'Your account has been updated.',
            noChange: 'Nothing to update'
          }
        },
        healthResults: {
          empty: 'Your health results are not yet available.'
        },
        participant: {
          create: {
            header: 'Add Participant',
            info: 'Want to add more than one participant at a time?',
            import: {
              error: 'Error format excel template.'
            }
          }
        },
        import: {
          header: 'Import Data',
          info: 'Want to add more than one data at a time?',
          import: {
            error: 'Error format excel template.'
          }
        },
        client: {
          manager: {
            button: {
              list: 'Manage Clients',
              create: 'Add a Client'
            }
          },
          create: {
            header: 'Add a Participant',
            info: 'Want to add more than one participant at a time? Click here to upload an excel file.'
          },
          remove: {
            error: 'Client is not empty. You can not delete it!'
          }
        },
        document: {
          alert: {
            titleUpload: 'Upload document',
            summaryUpload: 'Click below to confirm the document upload.',
            removeDocument: 'Are you sure you want to delete this document?',
            removeMultipleDocuments: 'Do you want to delete {{n}} documents?'
          },
          button: {
            title: {
              remove: 'Remove',
              removeMultiple: 'Remove',
              download: 'Download',
              downloadMultiple: 'Download',
              logs:'Audit-logs'
            }
          },
          breadcrumb: 'Important Documents',
          empty_1: 'No items match your search',
          empty_2: 'Do not have any document'
        },
        userManager: {
          alert: {
            removeHeadingSuccess: 'Successfully',
            restoreHeadingSuccess: 'Successfully',
            deleteHeadingSelectUser: 'Delete Multiple Users',
            restoreHeadingSelectUser: 'Restore Multiple Users',
            deleteButtonSelectUser: 'Delete',
            restoreButtonSelectUser: 'Restore',
            removeHeadingFail: 'Failure',
            restoreHeadingFail: 'Failure',
            removeUser: 'Are you sure you want to delete this user?',
            removePortfolio: 'Are you sure you want to delete this portfolio?',
            restoreUser: 'Are you sure you want to restore this user?',
            removeUser_2: 'Are you sure you want to delete {{name}}?',
            restoreUser_2: 'Are you sure you want to restore {{name}}?',
            removeMultipleUsers: 'Do you want to delete {{n}} users?',
            restoreMultipleUsers: 'Do you want to restore {{n}} users?',
            removeSuccess_1: 'Deleted 1 user successfully.',
            restoreSuccess_1: 'Restore 1 user successfully.',
            removeSuccess_2: 'Deleted {{n}} users successfully.',
            restoreSuccess_2: 'Restore {{n}} users successfully.',
            removeSuccess_3: 'Deleted {{userName}} successfully.',
            restoreSuccess_3: 'Restore {{userName}} successfully.',
            admin: {
              removeSuccess_1: 'Deleted 1 user successfully but Unable to delete {{name}}.',
              removeSuccess_2: 'Deleted 1 user successfully but Unable to delete {{n}} admins.',
              removeSuccess_3: 'Deleted {{n}} users successfully but Unable to delete {{name}}.',
              removeSuccess_4: 'Deleted {{n1}} users successfully but Unable to delete {{n2}} admins.',
              removeFail_1: 'Unable to delete {{name}} admin.',
              removeFail_2: 'Unable to delete {{n}} admins.'
            },
            agent: {
              removeSuccess_1: 'Deleted 1 user successfully but Unable to delete {{name}}.',
              removeSuccess_2: 'Deleted 1 user successfully but Unable to delete {{n}} agents.',
              removeSuccess_3: 'Deleted {{n}} users successfully but Unable to delete {{name}}.',
              removeSuccess_4: 'Deleted {{n1}} users successfully but Unable to delete {{n2}} agents.',
              removeFail_1: 'Unable to delete {{name}} agent.',
              removeFail_2: 'Unable to delete {{n}} agents.'
            },
            client: {
              removeSuccess_1: 'Deleted 1 user successfully but Unable to delete {{name}} client as it has participants.',
              removeSuccess_2: 'Deleted 1 user successfully but Unable to delete {{n}} clients as they have participants.',
              removeSuccess_3: 'Deleted {{n}} users successfully but Unable to delete {{name}} client as it has participants.',
              removeSuccess_4: 'Deleted {{n1}} users successfully but Unable to delete {{n2}} clients as they have participants.',
              removeFail_1: 'Unable to delete {{name}} client as it has participants.',
              removeFail_2: 'Unable to delete {{n}} clients as they have participants.'
            },
            participant: {
              removeSuccess_1: 'Deleted 1 user successfully but Unable to delete {{name}}.',
              removeSuccess_2: 'Deleted 1 user successfully but Unable to delete {{n}} participants.',
              removeSuccess_3: 'Deleted {{n}} users successfully but Unable to delete {{name}}.',
              removeSuccess_4: 'Deleted {{n1}} users successfully but Unable to delete {{n2}} participants.',
              restoreFail_1: 'Unable to restore {{name}}.',
              restoreFail_2: 'Unable to restore {{n}} users.',
              removeFail_1: 'Unable to delete {{name}} participant.',
              removeFail_2: 'Unable to delete {{n}} participants.'
            }
          },
          button: {
            title: {
              remove: 'Remove',
              restore: 'Restore',
              removeMultiple: 'Remove',
              restoreMultiple: 'Restore',
              permanentlyDelete: 'Permanently Delete',
              edit: 'Edit',
              download: 'Download',
              view: 'View',
              logs:'Audit-logs',
              loginLogs: 'Login Logs'
            }
          },
          empty_1: 'No users match your search',
          empty_2: 'No users match your search'
        },
        faqs: {
          alert: {
            remove: 'Are you sure you want to delete this question?',
            fail: 'Unable to delete'
          },
          empty: 'No result.'
        },
        faqCategories: {
          empty: 'No result.'
        },
        registration: {
          alert: {
            againHeading: 'Registration',
            againMessage: 'Are you sure you register again?'
          }
        },
        auditLogs: {
          screenName :{
            myProfile: 'My Profile',
            mySettings: 'My Settings',
            addParticipant: 'Add Participant',
            editParticipant: 'Edit Participant',
            userManager:'User Manager',
            mySetting: 'My Setting',
            addDependent: 'Add Dependent',
            editChild: 'Edit Child',                     
            addClient: 'Add Client',
            addHealthCoach: 'Add Health Coach',            
            editHealthCoach: 'Edit Health Coach',            addHealthCoachManager: 'Add Health Coach Manager',            editHealthCoachManager: 'Edit Health Coach Manager',
            editClient: 'Edit Client',            
            addAgent: 'Add Agent',            
            editAgent: 'Edit an Agent',           
            addClientManager: 'Add a Client Manager',            editClientManager: 'Edit a Client Manager',
            faq: 'Add FAQs'
          }
        }
      };
      

      this.$get = function () {
        return {
          en_US: this.en_US
        };
      };
    }
  );