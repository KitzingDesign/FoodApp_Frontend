import React from "react";
import Question from "./Question";
import styles from "./FAQ.module.css";

const FAQ = () => {
  return (
    <div className={styles.container}>
      <Question
        title="Do I need to create an account to use the app?"
        answer="
Yes, you need to create an account to use the app. It&acute;s free to sign up, and having an account allows you to save your favorite recipes."
      />
      <Question
        title="Can I log in using my Google account?"
        answer="Yes, log in using your Google accounts is possible."
      />

      <Question
        title="Can I see recipes created by other users in my personal cookbook?"
        answer="No, in your personal cookbook, you can only see your own recipes. And no one else can see your recipes."
      />
    </div>
  );
};

export default FAQ;
