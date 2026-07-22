import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, phone, email, preferredContact, dob, lastFourSSN,
      recordType, caseNumber, countyOfResidence, countyOfFiling,
      countyOfConviction, yearOfIncident, incidentDescription,
      completedProbation, outstandingFines, onProbation,
      multipleCases, referralSource,
    } = body;

    await pool.query(`
      CREATE TABLE IF NOT EXISTS intake_submissions (
        id SERIAL PRIMARY KEY,
        full_name TEXT, phone TEXT, email TEXT,
        preferred_contact TEXT, dob TEXT, last_four_ssn TEXT,
        record_type TEXT, case_number TEXT,
        county_of_residence TEXT, county_of_filing TEXT,
        county_of_conviction TEXT, year_of_incident TEXT,
        incident_description TEXT,
        completed_probation BOOLEAN, outstanding_fines BOOLEAN,
        on_probation BOOLEAN, multiple_cases BOOLEAN,
        referral_source TEXT,
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await pool.query(
      `INSERT INTO intake_submissions (
        full_name, phone, email, preferred_contact, dob, last_four_ssn,
        record_type, case_number, county_of_residence, county_of_filing,
        county_of_conviction, year_of_incident, incident_description,
        completed_probation, outstanding_fines, on_probation,
        multiple_cases, referral_source
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [
        fullName, phone, email, preferredContact, dob, lastFourSSN,
        recordType, caseNumber, countyOfResidence, countyOfFiling,
        countyOfConviction, yearOfIncident, incidentDescription,
        completedProbation, outstandingFines, onProbation,
        multipleCases, referralSource,
      ]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NOTIFY_EMAIL,
        pass: process.env.NOTIFY_EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.NOTIFY_EMAIL,
      to: process.env.NOTIFY_EMAIL,
      subject: `🆕 New Clean Slate Intake: ${fullName}`,
      html: `
        <h2>New Intake Submission</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;width:100%">
          <tr style="background:#f3f4f6"><td style="padding:8px"><strong>Name</strong></td><td style="padding:8px">${fullName}</td></tr>
          <tr><td style="padding:8px"><strong>Phone</strong></td><td style="padding:8px">${phone}</td></tr>
          <tr style="background:#f3f4f6"><td style="padding:8px"><strong>Email</strong></td><td style="padding:8px">${email}</td></tr>
          <tr><td style="padding:8px"><strong>Preferred Contact</strong></td><td style="padding:8px">${preferredContact}</td></tr>
          <tr style="background:#f3f4f6"><td style="padding:8px"><strong>DOB</strong></td><td style="padding:8px">${dob}</td></tr>
          <tr><td style="padding:8px"><strong>Record Type</strong></td><td style="padding:8px">${recordType}</td></tr>
          <tr style="background:#f3f4f6"><td style="padding:8px"><strong>Case #</strong></td><td style="padding:8px">${caseNumber}</td></tr>
          <tr><td style="padding:8px"><strong>County of Residence</strong></td><td style="padding:8px">${countyOfResidence}</td></tr>
          <tr style="background:#f3f4f6"><td style="padding:8px"><strong>County of Filing</strong></td><td style="padding:8px">${countyOfFiling}</td></tr>
          <tr><td style="padding:8px"><strong>Year of Incident</strong></td><td style="padding:8px">${yearOfIncident}</td></tr>
          <tr style="background:#f3f4f6"><td style="padding:8px"><strong>Completed Probation?</strong></td><td style="padding:8px">${completedProbation ? 'Yes' : 'No'}</td></tr>
          <tr><td style="padding:8px"><strong>Outstanding Fines?</strong></td><td style="padding:8px">${outstandingFines ? 'Yes' : 'No'}</td></tr>
          <tr style="background:#f3f4f6"><td style="padding:8px"><strong>On Probation/Parole?</strong></td><td style="padding:8px">${onProbation ? 'Yes' : 'No'}</td></tr>
          <tr><td style="padding:8px"><strong>Multiple Cases?</strong></td><td style="padding:8px">${multipleCases ? 'Yes' : 'No'}</td></tr>
          <tr style="background:#f3f4f6"><td style="padding:8px"><strong>Referral Source</strong></td><td style="padding:8px">${referralSource}</td></tr>
          <tr><td style="padding:8px"><strong>Incident Description</strong></td><td style="padding:8px">${incidentDescription}</td></tr>
          <tr style="background:#f3f4f6"><td style="padding:8px"><strong>Submitted</strong></td><td style="padding:8px">${new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'})}</td></tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/submit] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
