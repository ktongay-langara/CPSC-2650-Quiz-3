# CPSC-2650-Quiz-3

Start a new terminal for the frontend. Change to the frontend directory (e.g. `cd email2/frontend`). Install and run the React frontend:

    yarn install
    yarn build

Start a new terminal for the backend. Change to the backend directory (e.g. `cd email2/backend`) Install and run the Feathers backend:

    npm install
    PORT=8080 npm run dev

Test the skeleton application by using the web preview. You should see the basic application.

### Adding Email

We are going to modify the application so that it can send email notifications or transactional email.

#### Register for a SendGrid Account

Login into your Google account if you have not already done so.

Go to the [SendGrid marketplace page](https://console.cloud.google.com/marketplace/details/sendgrid-app/sendgrid-email). Click on the “Start with the free plan” button.

On the subscription, choose the free plan, tick the box, and click the “Subscribe” button.

On the next page, click the “Register with SendGrid” button.

Complete the form … eventually you should be redirected back to Google marketplace. The page should indicate that you are subscribed to the free plan.

Follow the button to “Manage API keys on the SendGrid website”. Login with your SendGrid credentials.

#### Authenticate Your Domain for Sending

Under “Settings”, choose “Sender Authentication”.

In the “Authenticate Your Domain” section, click on the “Get Started” button. For “DNS Host”, choose “Google Cloud”. For “brand the links for this domain”, choose “No”. Click on the “Next” button.

For “Domain You Send From”, enter “4949NN.xyz”. Click on the “Next” button.

Create the “CNAME” records identified. Click on the “Verify” button once you are sure the “CNAME” records are visible.

#### Create a SendGrid API Key for SMTP Relay

Click on “Email API | Integration Guide”. Choose “SMTP Relay”. Name your new API key. Click on the “Create Key” button. Make a note of the server, ports, username, and password.

#### Frontend Changes

In `frontend/src/emailform.js`, add the code to import the Feathers client:

    import client from './feathers';

In the constructor, initialize the component’s state to empty:

      constructor(props) {
        super(props);
    
        this.state = {};
      }

Add the code so that when the component mounts, we update the state with a handle to the backend “email” service:

      componentDidMount() {
        const email = client.service('email');
    
        this.setState({email})
      }

Finally, we’ll set up the event handler so that when the user fills out the form and clicks “Send”, we extract the “To:” addresss and invoke the “create” method on the backend email service:

      sendEmail(ev) {
        ev.preventDefault();
        const inputTo = ev.target.querySelector('[id="to"]');
        const to = inputTo.value.trim();
    
        console.log( "To: " + to );
    
        this.state.email.create({
          to
        })
        .then(() => {
          inputTo.value = '';
        });
      }

Rebuild the frontend with `yarn build`.

#### Backend Changes

In the terminal where the backend is runnig, stop it (Ctrl-C).

Add a new hook to the application:

    npm i -g @feathersjs/cli   # only if needed
    feathers generate hook

Answer the prompts as follows:

    What is the name of the hook? sendEmail
    What kind of hook should it be? after
    What service(s) should this hook be for (select none to add it yourself)? email
    What methods should the hook be for (select none to add it yourself)? create
    

In `backend/src/hooks/send-email.ts` add the code to extract the result from the context and log it to the console:

      return async (context: HookContext) => {
        const { result } = context;
        
        console.log( result );
        
        return context;
      };

Restart the backend (e.g. `PORT=8080 npm run dev`).

Verify the application works end-to-end so that when you fill in an email address in the frontend and “Send”, you see the email address logged on the backend.

We don’t want our application to become a SPAM relay, so create a list of safe recipients and check before we actually send the email:

      return async (context: HookContext) => {
        const { result } = context;
        
        // PUT YOUR SAFE EMAIL RECIPIENTS HERE
        const safeRecipients = ["add your email", "add your email"];
        
        if ( !safeRecipients.includes(result['to'])) {
          console.log( "BAD: " + result['to']);
          return context;
        }
    
        console.log( "GOOD: " + result['to']);
        
        return context;
      };

Stop the backend (Ctrl-C).

Instal nodemailer:

    npm install --save nodemailer
    npm install --save @types/nodemailer

Import the module into `backend/src/hooks/send-email.ts`:

    import { Hook, HookContext } from '@feathersjs/feathers';
    import nodemailer from 'nodemailer';

Add the code to set up the transporter:

      return async (context: HookContext) => {
        const { result } = context;
        
        // PUT YOUR SAFE EMAIL RECIPIENTS HERE
        const safeRecipients = ["[email protected]", "[email protected]"];
        
        if ( !safeRecipients.includes(result['to'])) {
          console.log( "BAD: " + result['to']);
          return context;
        }
    
        console.log( "GOOD: " + result['to']);
        
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.sendgrid.net",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: "apikey", // SendGrid user
            pass: process.env.SENDGRID_PASSWORD // SendGrid password
          }
        });
        
        return context;
      };

Finally, add the code to send the actual eamil:

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"No Reply" <[email protected]>', // PUT YOUR DOMAIN HERE
          to: result.to, // list of receivers
          subject: "Hello " + result.id, // Subject line
          text: "Your id is: " + result.id // plain text body
        });
        
        console.log("Message sent: %s", info.messageId);

Restart the backend (e.g. `PORT=8080 npm run dev`) and test. If you receive the email, you can click the “Verify Integration” button in the SendGrid console.

Bonus
----------

1.  Add a new in memory service ‘sms’ to the backend.
2.  Add a new page ‘SMS’ to the frontend with a field for a phone number.
3.  Create a Twilio account.
4.  Integrate the frontend and backend to actaully send a SMS message.
