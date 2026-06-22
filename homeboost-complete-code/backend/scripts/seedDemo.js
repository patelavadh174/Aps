import bcrypt from 'bcryptjs';
import { pool } from '../src/config/db.js';

const password = 'Password123!';
const passwordHash = await bcrypt.hash(password, 12);

async function main() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [hbt] = await conn.execute(
      `INSERT INTO home_buying_teams (name, support_email, support_phone, status)
       VALUES ('Home Buying Team East', 'support@homeboost.test', '555-0100', 'active')
       ON DUPLICATE KEY UPDATE name = name`
    );
    const hbtId = hbt.insertId || (await conn.execute("SELECT id FROM home_buying_teams WHERE name = 'Home Buying Team East'"))[0][0].id;

    await conn.execute(
      `INSERT INTO employers (name, industry, status)
       VALUES ('AMC Manufacturing', 'Manufacturing', 'active')
       ON DUPLICATE KEY UPDATE industry = VALUES(industry)`
    );
    const [[employer]] = await conn.execute("SELECT id FROM employers WHERE name = 'AMC Manufacturing'");

    await conn.execute(
      `INSERT INTO partnerships (employer_id, hbt_id, name, slug, hero_headline, hero_subheadline, primary_cta_label, status)
       VALUES (?, ?, 'AMC HomeBoost Program', 'amc', 'Welcome to your employer-sponsored HomeBoost program', 'Learn how to prepare for buying a home with practical education, readiness guidance, and support from your Home Buying Team.', 'Start Your HomeBoost Journey', 'active')
       ON DUPLICATE KEY UPDATE hbt_id = VALUES(hbt_id), hero_headline = VALUES(hero_headline), hero_subheadline = VALUES(hero_subheadline)`,
      [employer.id, hbtId]
    );
    const [[partnership]] = await conn.execute("SELECT id FROM partnerships WHERE slug = 'amc'");

    const users = [
      ['Admin', 'User', 'admin@homeboost.test', 'admin', null, null],
      ['HBT', 'Admin', 'hbt.admin@homeboost.test', 'hbt_admin', null, hbtId],
      ['HBT', 'Member', 'hbt.member@homeboost.test', 'hbt_member', null, hbtId],
      ['Employee', 'Demo', 'employee@homeboost.test', 'employee', partnership.id, hbtId]
    ];
    for (const [first, last, email, role, partnershipId, userHbtId] of users) {
      await conn.execute(
        `INSERT INTO users (first_name, last_name, email, password_hash, role, status, partnership_id, hbt_id)
         VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role), partnership_id = VALUES(partnership_id), hbt_id = VALUES(hbt_id), status = 'active'`,
        [first, last, email, passwordHash, role, partnershipId, userHbtId]
      );
    }

    const [[hbtAdmin]] = await conn.execute("SELECT id FROM users WHERE email = 'hbt.admin@homeboost.test'");
    const [[hbtMember]] = await conn.execute("SELECT id FROM users WHERE email = 'hbt.member@homeboost.test'");
    const [[employee]] = await conn.execute("SELECT id FROM users WHERE email = 'employee@homeboost.test'");
    await conn.execute(
      `INSERT IGNORE INTO team_members (hbt_id, user_id, title, status) VALUES (?, ?, 'Team Lead', 'active'), (?, ?, 'Advisor', 'active')`,
      [hbtId, hbtAdmin.id, hbtId, hbtMember.id]
    );

    await conn.execute(
      `INSERT INTO resources (title, slug, category, summary, body, visibility, status, hbt_id, created_by)
       VALUES
       ('Home Buying Readiness Checklist', 'home-buying-readiness-checklist', 'Readiness', 'A practical checklist for preparing to buy a home.', 'Review income, credit, savings, debt, timeline, and support needs before you shop.', 'employee', 'published', ?, ?),
       ('Understanding Pre-Approval', 'understanding-pre-approval', 'Mortgage Basics', 'Learn what pre-approval can and cannot promise.', 'Pre-approval is a useful readiness step, but it is not a final loan approval. Keep documents current and avoid major financial changes.', 'public', 'published', ?, ?),
       ('Down Payment Planning Basics', 'down-payment-planning-basics', 'Savings', 'Break down down payment, closing costs, emergency savings, and monthly comfort.', 'Good planning means understanding total cash needed, not just the down payment headline.', 'employee', 'published', ?, ?)
       ON DUPLICATE KEY UPDATE summary = VALUES(summary), body = VALUES(body), status = VALUES(status)`,
      [hbtId, hbtAdmin.id, hbtId, hbtAdmin.id, hbtId, hbtAdmin.id]
    );

    await conn.execute(
      `INSERT INTO pricing_plans (name, description, price_label, feature_list, display_order, status)
       VALUES
       ('Starter', 'Launch a branded employee benefit portal.', 'Custom', 'Employer portal\nEmployee resources\nBasic reporting', 1, 'active'),
       ('Growth', 'Add team operations and employee engagement workflows.', 'Custom', 'Everything in Starter\nCSV enrollment\nMessaging\nEvents', 2, 'active'),
       ('Enterprise', 'Scale HomeBoost across multiple employer programs.', 'Custom', 'Advanced reporting\nCustom integrations\nPriority support', 3, 'active')`
    );

    await conn.execute(
      `INSERT INTO faqs (question, answer, category, display_order, status)
       VALUES
       ('Is HomeBoost a mortgage lender?', 'No. HomeBoost is an education and guidance benefit. It helps employees understand next steps and connect with support.', 'General', 1, 'active'),
       ('Can my employer see my private quiz answers?', 'The platform should be configured so sensitive employee readiness information is visible only to approved support and admin roles.', 'Privacy', 2, 'active'),
       ('Do I need to be ready to buy immediately?', 'No. HomeBoost supports employees at many stages, from early planning to active home search.', 'Employee', 3, 'active')`
    );

    const [quizResult] = await conn.execute(
      `INSERT INTO quizzes (title, description, status)
       VALUES ('Home Buying Readiness Assessment', 'A short readiness quiz for education and follow-up. This is not a loan approval.', 'active')`
    );
    const quizId = quizResult.insertId;
    const questions = [
      ['How soon are you hoping to buy a home?', [['0-6 months', 3], ['6-12 months', 2], ['More than 12 months', 1]]],
      ['How comfortable are you with your current monthly budget?', [['Very comfortable', 3], ['Somewhat comfortable', 2], ['Not sure yet', 1]]],
      ['Have you reviewed your credit recently?', [['Yes', 3], ['I know the basics', 2], ['Not yet', 1]]]
    ];
    for (let i = 0; i < questions.length; i += 1) {
      const [text, options] = questions[i];
      const [question] = await conn.execute(
        `INSERT INTO quiz_questions (quiz_id, question_text, question_type, display_order) VALUES (?, ?, 'single_choice', ?)`,
        [quizId, text, i + 1]
      );
      for (let j = 0; j < options.length; j += 1) {
        await conn.execute(
          `INSERT INTO quiz_options (question_id, option_text, readiness_points, display_order) VALUES (?, ?, ?, ?)`,
          [question.insertId, options[j][0], options[j][1], j + 1]
        );
      }
    }

    await conn.execute(
      `INSERT INTO events (title, description, event_type, starts_at, ends_at, location, partnership_id, hbt_id, status, created_by)
       VALUES ('First-Time Buyer Workshop', 'A practical session covering readiness, mortgage basics, and next steps.', 'workshop', DATE_ADD(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 10 DAY) + INTERVAL 1 HOUR, 'Online', ?, ?, 'published', ?)`,
      [partnership.id, hbtId, hbtAdmin.id]
    );

    const [thread] = await conn.execute(
      `INSERT INTO message_threads (employee_id, hbt_id, subject, status) VALUES (?, ?, 'HomeBoost Support', 'open')`,
      [employee.id, hbtId]
    );
    await conn.execute(
      `INSERT INTO messages (thread_id, sender_id, body) VALUES (?, ?, 'Hi, I would like help understanding what I should do first.')`,
      [thread.insertId, employee.id]
    );

    await conn.commit();
    console.log('Demo seed complete. Password for all demo accounts:', password);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
