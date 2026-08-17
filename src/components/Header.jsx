import { motion } from "framer-motion";
import "./Header.css";
function Header({
    user,
    darkMode,
    setDarkMode,
    logout,
    language,
    setLanguage,
    texts,
}) {
  return (
        <div className="topbar">

        <div className="topbar-left">
          <div className="logo-circle">
            <img src="/task-app-logo.png" alt="Task App Logo" />
          </div>

          <div>
            <h3>Task-App</h3>
            <p>{texts.header.subtitle}</p>
          </div>
        </div>

        <div className="topbar-right">

          <div className="user-box">
            <div className="online-dot"></div>
            <span>{user.email}</span>
          </div>

          <button
                className="dark-toggle"
                onClick={() => setDarkMode(prev => !prev)}
            >
                {darkMode ? "☀️" : "🌙"}
            </button>

            <div className="language-switch">

              <button
                className={language === "tr" ? "active" : ""}
                onClick={() => setLanguage("tr")}
              >
                TR
              </button>

              <button
                className={language === "en" ? "active" : ""}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>

            </div>

          <button
            className="logout-btn"
            onClick={logout}
          >
            {texts.header.logout}
          </button>

        </div>
      </div>
    );

}
export default Header;