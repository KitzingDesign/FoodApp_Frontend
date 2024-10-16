import Footer from "../footer/Footer";
import styles from "./TermsAndConditions.module.css";
import { Link } from "react-router-dom";
import LogoIcon from "../../../public/logo";

const TermsAndConditions = () => {
  return (
    <div className={styles.upperContainer}>
      <Link to="/" className={styles.logoContainer}>
        <LogoIcon />
      </Link>
      <div className={styles.container}>
        <h1>Terms and Conditions</h1>
        <h2>1. Introduction</h2>
        <p>
          <strong>Website Name:</strong> MatMatMaten
          <br />
          <strong>Effective Date:</strong> 2024-10-15
          <br />
          <strong>Short Description:</strong> Welcome to MatMatMaten. This
          website is a passion project build by me to handle a common problem,
          and to learn more about programming. By using our website and
          services, you agree to the following terms and conditions. If you do
          not agree to these terms, please do not use our services.
        </p>
        <h2>2. Eligibility</h2>
        <p>
          <strong>User Requirements:</strong> Users must be at least 13 years
          old or have parental permission to use this site. You must provide
          accurate, complete information when signing up.
        </p>
        <h2>3. User Accounts</h2>
        <p>
          <strong>Account Security:</strong> You are responsible for keeping
          your login credentials secure. MatMatMaten is not responsible for
          unauthorized access to your account.
          <br />
          <strong>Termination of Accounts:</strong> We reserve the right to
          suspend or delete accounts that violate our terms or policies.
        </p>
        <h2>4. User-Generated Content</h2>
        <p>
          <strong>Recipe Submission:</strong> By submitting recipes (either
          through manual input or recipe scrapers), you confirm that you have
          the right to share this content and grant us a license to display it
          on our platform.
          <br />
          <strong>Image Uploads:</strong> When uploading images (to be stored
          via Cloudinary), you confirm that you own or have permission to upload
          the image.
          <br />
          <strong>Copyright:</strong> We are not liable for any copyright
          infringement. If you believe content on our site infringes your
          rights, please contact us.
        </p>
        <h2>5. Data Collection & Storage</h2>
        <p>
          <strong>Personal Data:</strong> We collect personal information like
          names, email addresses, and images during the signup process. We store
          user profile pictures in Cloudinary and use Firebase Authentication
          for login.
          <br />
          <strong>Cookies:</strong> We use cookies to store user sessions and
          refresh tokens.
          <br />
          <strong>Third-Party Services:</strong> We use Cloudinary for image
          storage, Firebase for authentication, and other services (such as
          MySQL database) to operate the platform. Your data may be stored on
          these third-party services.
          <br />
          <strong>Data Security:</strong> While we take steps to secure your
          data, no online system is completely secure. You use our site at your
          own risk.
        </p>
        <h2>6. Intellectual Property</h2>
        <p>
          <strong>Platform Ownership:</strong> The design, functionality, and
          content of MatMatMaten (except user-submitted content) are owned by us
          and protected by copyright laws.
          <br />
          <strong>Limited License:</strong> We grant you a limited,
          non-exclusive, revocable license to use our services for personal use.
          You may not sell or resell our services.
        </p>
        <h2>7. Limitation of Liability</h2>
        <p>
          <strong>No Guarantees:</strong> MatMatMaten is provided on an "as is"
          and "as available" basis. We do not guarantee the accuracy or
          reliability of recipe data (whether scraped from other websites or
          entered manually).
          <br />
          <strong>Use at Your Own Risk:</strong> You use MatMatMaten at your own
          risk. We are not liable for damages related to your use of our site,
          including loss of recipes or personal data.
          <br />
          <strong>External Links:</strong> MatMatMaten may link to third-party
          websites. We are not responsible for the content or privacy practices
          of those sites.
        </p>
        <h2>8. Termination of Service</h2>
        <p>
          <strong>Discretionary Termination:</strong> We reserve the right to
          terminate or suspend your access to our platform at our discretion,
          with or without notice.
        </p>
        <h2>10. Changes to the Terms</h2>
        <p>
          <strong>Updates:</strong> We may update these terms from time to time.
          The updated terms will be posted on this page, and it is your
          responsibility to review them periodically.
        </p>
        <h2>11. Contact Information</h2>
        <p>
          <strong>Contact Us:</strong> If you have any questions or concerns
          about these terms, please contact us at jakob.kitzing@hotmail.com
        </p>
        <h1>Privacy Policy</h1>
        <h2>1. What Data We Collect</h2>
        <p>
          <strong>Personal Information:</strong> When you create an account, we
          collect your first name, last name, email address, and an optional
          profile image.
          <br />
          <strong>Cookies:</strong> We use cookies to manage user sessions and
          store refresh tokens.
        </p>
        <h2>2. How We Use Your Data</h2>
        <p>
          <strong>Authentication:</strong> We use Firebase to authenticate users
          via email or Google accounts.
          <br />
          <strong>Recipe Data:</strong> We store recipe data (including images
          via Cloudinary) to provide our service.
        </p>
        <h2>3. Third-Party Services</h2>
        <p>
          <strong>Firebase:</strong> Used for authentication (Google login or
          email).
          <br />
          <strong>Cloudinary:</strong> Used for image storage.
          <br />
          <strong>MySQL:</strong> Used for storing user and recipe data.
        </p>
        <h2>4. Data Security</h2>
        <p>
          <strong>Storage:</strong> Data is stored securely using third-party
          services, but we cannot guarantee 100% security.
        </p>
        <h2>5. Your Rights</h2>
        <p>
          <strong>Access and Deletion:</strong> You have the right to request
          access to or deletion of your data. Contact us at
          jakob.kitzing@hotmail.com to make such requests.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
