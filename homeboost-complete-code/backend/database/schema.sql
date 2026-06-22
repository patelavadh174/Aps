CREATE DATABASE IF NOT EXISTS homeboost CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE homeboost;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS message_threads;
DROP TABLE IF EXISTS quiz_answers;
DROP TABLE IF EXISTS quiz_submissions;
DROP TABLE IF EXISTS quiz_options;
DROP TABLE IF EXISTS quiz_questions;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS enrollment_batches;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS section_cards;
DROP TABLE IF EXISTS page_sections;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS pricing_plans;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS partnerships;
DROP TABLE IF EXISTS employers;
DROP TABLE IF EXISTS home_buying_teams;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE home_buying_teams (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  support_email VARCHAR(255) NOT NULL,
  support_phone VARCHAR(50),
  status ENUM('active','paused','archived') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE employers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(180) NOT NULL UNIQUE,
  industry VARCHAR(120),
  logo_url VARCHAR(500),
  status ENUM('active','paused','archived') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE partnerships (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employer_id BIGINT NOT NULL,
  hbt_id BIGINT,
  name VARCHAR(220) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  hero_headline VARCHAR(220),
  hero_subheadline TEXT,
  primary_cta_label VARCHAR(80) DEFAULT 'Start Your HomeBoost Journey',
  status ENUM('active','paused','archived') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_partnership_employer FOREIGN KEY (employer_id) REFERENCES employers(id) ON DELETE CASCADE,
  CONSTRAINT fk_partnership_hbt FOREIGN KEY (hbt_id) REFERENCES home_buying_teams(id) ON DELETE SET NULL,
  INDEX idx_partnership_hbt (hbt_id),
  INDEX idx_partnership_status (status)
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','hbt_admin','hbt_member','employee') NOT NULL DEFAULT 'employee',
  status ENUM('active','disabled','invited') NOT NULL DEFAULT 'active',
  partnership_id BIGINT,
  hbt_id BIGINT,
  enrollment_batch_id BIGINT,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_partnership FOREIGN KEY (partnership_id) REFERENCES partnerships(id) ON DELETE SET NULL,
  CONSTRAINT fk_user_hbt FOREIGN KEY (hbt_id) REFERENCES home_buying_teams(id) ON DELETE SET NULL,
  INDEX idx_user_role (role),
  INDEX idx_user_status (status),
  INDEX idx_user_partnership (partnership_id),
  INDEX idx_user_hbt (hbt_id)
);

CREATE TABLE team_members (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  hbt_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  title VARCHAR(120),
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_team_member_hbt FOREIGN KEY (hbt_id) REFERENCES home_buying_teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_team_member_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_team_member (hbt_id, user_id)
);

CREATE TABLE pages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  meta_description TEXT,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE page_sections (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  page_id BIGINT NOT NULL,
  section_key VARCHAR(120) NOT NULL,
  heading VARCHAR(180),
  body TEXT,
  display_order INT NOT NULL DEFAULT 100,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  CONSTRAINT fk_page_section_page FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  INDEX idx_page_section_page (page_id)
);

CREATE TABLE section_cards (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  section_id BIGINT NOT NULL,
  title VARCHAR(180) NOT NULL,
  body TEXT,
  icon VARCHAR(80),
  display_order INT NOT NULL DEFAULT 100,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  CONSTRAINT fk_section_card_section FOREIGN KEY (section_id) REFERENCES page_sections(id) ON DELETE CASCADE
);

CREATE TABLE resources (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  category VARCHAR(120) NOT NULL DEFAULT 'General',
  summary TEXT,
  body LONGTEXT NOT NULL,
  visibility ENUM('public','employee','hbt','admin') NOT NULL DEFAULT 'employee',
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  hbt_id BIGINT,
  created_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_resource_hbt FOREIGN KEY (hbt_id) REFERENCES home_buying_teams(id) ON DELETE SET NULL,
  CONSTRAINT fk_resource_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_resource_status_visibility (status, visibility),
  INDEX idx_resource_hbt (hbt_id)
);

CREATE TABLE pricing_plans (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price_label VARCHAR(80) NOT NULL DEFAULT 'Custom',
  feature_list TEXT,
  display_order INT NOT NULL DEFAULT 100,
  status ENUM('active','archived') NOT NULL DEFAULT 'active'
);

CREATE TABLE faqs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(120) DEFAULT 'General',
  display_order INT NOT NULL DEFAULT 100,
  status ENUM('active','archived') NOT NULL DEFAULT 'active'
);

CREATE TABLE quizzes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  status ENUM('draft','active','archived') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_questions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  quiz_id BIGINT NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('single_choice','text') NOT NULL DEFAULT 'single_choice',
  display_order INT NOT NULL DEFAULT 100,
  CONSTRAINT fk_quiz_question_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  INDEX idx_quiz_question_quiz (quiz_id)
);

CREATE TABLE quiz_options (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  question_id BIGINT NOT NULL,
  option_text VARCHAR(255) NOT NULL,
  readiness_points INT NOT NULL DEFAULT 0,
  display_order INT NOT NULL DEFAULT 100,
  CONSTRAINT fk_quiz_option_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
  INDEX idx_quiz_option_question (question_id)
);

CREATE TABLE quiz_submissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  quiz_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  readiness_score INT NOT NULL DEFAULT 0,
  status ENUM('submitted','reviewed','archived') NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_submission_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  CONSTRAINT fk_submission_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_submission_quiz_user (quiz_id, user_id),
  INDEX idx_submission_created (created_at)
);

CREATE TABLE quiz_answers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  submission_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  option_id BIGINT,
  answer_text TEXT,
  CONSTRAINT fk_answer_submission FOREIGN KEY (submission_id) REFERENCES quiz_submissions(id) ON DELETE CASCADE,
  CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
  CONSTRAINT fk_answer_option FOREIGN KEY (option_id) REFERENCES quiz_options(id) ON DELETE SET NULL
);

CREATE TABLE enrollment_batches (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  partnership_id BIGINT NOT NULL,
  uploaded_by BIGINT,
  original_filename VARCHAR(255),
  batch_code CHAR(36) NOT NULL,
  total_rows INT NOT NULL DEFAULT 0,
  imported_rows INT NOT NULL DEFAULT 0,
  skipped_rows INT NOT NULL DEFAULT 0,
  status ENUM('active','revoked') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL,
  CONSTRAINT fk_batch_partnership FOREIGN KEY (partnership_id) REFERENCES partnerships(id) ON DELETE CASCADE,
  CONSTRAINT fk_batch_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_batch_partnership (partnership_id)
);

ALTER TABLE users
  ADD CONSTRAINT fk_user_enrollment_batch FOREIGN KEY (enrollment_batch_id) REFERENCES enrollment_batches(id) ON DELETE SET NULL;

CREATE TABLE events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(220) NOT NULL,
  description TEXT,
  event_type VARCHAR(80) NOT NULL DEFAULT 'workshop',
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NULL,
  location VARCHAR(255),
  partnership_id BIGINT,
  hbt_id BIGINT,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  created_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_event_partnership FOREIGN KEY (partnership_id) REFERENCES partnerships(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_hbt FOREIGN KEY (hbt_id) REFERENCES home_buying_teams(id) ON DELETE SET NULL,
  CONSTRAINT fk_event_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_event_starts (starts_at),
  INDEX idx_event_partnership (partnership_id)
);

CREATE TABLE contact_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(180),
  message TEXT NOT NULL,
  status ENUM('new','read','closed') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_status_created (status, created_at)
);

CREATE TABLE message_threads (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id BIGINT NOT NULL,
  hbt_id BIGINT,
  subject VARCHAR(180) NOT NULL DEFAULT 'HomeBoost Support',
  status ENUM('open','pending','closed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_thread_employee FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_thread_hbt FOREIGN KEY (hbt_id) REFERENCES home_buying_teams(id) ON DELETE SET NULL,
  INDEX idx_thread_employee (employee_id),
  INDEX idx_thread_hbt (hbt_id),
  INDEX idx_thread_status_updated (status, updated_at)
);

CREATE TABLE messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  thread_id BIGINT NOT NULL,
  sender_id BIGINT NOT NULL,
  body TEXT NOT NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_message_thread FOREIGN KEY (thread_id) REFERENCES message_threads(id) ON DELETE CASCADE,
  CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_message_thread_created (thread_id, created_at)
);

CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  actor_user_id BIGINT,
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(120),
  entity_id BIGINT,
  metadata JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_action_created (action, created_at)
);
