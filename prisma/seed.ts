import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { RIASEC, RIASEC_CONTENT } from "../src/lib/skills";
import { STUDENT_QUESTION_MAP } from "../src/lib/mi";

const prisma = new PrismaClient();

// --- EMPLOYEE test (previous 50-statement, 1–5 scale) ---
const EMPLOYEE_QUESTIONS: [number, string, string, string, boolean][] = [
  [1, "I like to be the leader of my team in everything I do.", "ਮੈਂ ਹਰ ਕੰਮ ਵਿੱਚ ਆਪਣੀ ਟੀਮ ਦਾ ਆਗੂ ਬਣਨਾ ਪਸੰਦ ਕਰਦਾ ਹਾਂ।", "confidence", false],
  [2, "I listen to everyone when making decisions.", "ਫ਼ੈਸਲਾ ਲੈਂਦੇ ਸਮੇਂ ਮੈਂ ਸਾਰਿਆਂ ਦੀ ਗੱਲ ਸੁਣਦਾ ਹਾਂ।", "decision", false],
  [3, "I get irritated when I don't get my work done quickly.", "ਜਦੋਂ ਮੇਰਾ ਕੰਮ ਜਲਦੀ ਨਹੀਂ ਹੁੰਦਾ ਤਾਂ ਮੈਨੂੰ ਖਿਝ ਆ ਜਾਂਦੀ ਹੈ।", "aggressive", false],
  [4, "When I find something wrong, I investigate it further.", "ਜਦੋਂ ਮੈਨੂੰ ਕੁਝ ਗ਼ਲਤ ਲੱਗਦਾ ਹੈ ਤਾਂ ਮੈਂ ਇਸ ਦੀ ਹੋਰ ਜਾਂਚ ਕਰਦਾ ਹਾਂ।", "decision", false],
  [5, "I get frustrated when problems arise at work.", "ਕੰਮ ਵਿੱਚ ਸਮੱਸਿਆਵਾਂ ਆਉਣ 'ਤੇ ਮੈਂ ਨਿਰਾਸ਼ ਹੋ ਜਾਂਦਾ ਹਾਂ।", "emotional", true],
  [6, "In a fast changing environment, I value my time.", "ਤੇਜ਼ੀ ਨਾਲ ਬਦਲਦੇ ਮਾਹੌਲ ਵਿੱਚ ਮੈਂ ਆਪਣੇ ਸਮੇਂ ਦੀ ਕਦਰ ਕਰਦਾ ਹਾਂ।", "time", false],
  [7, "I resolve challenges at work in a very peaceful manner.", "ਮੈਂ ਕੰਮ ਦੀਆਂ ਚੁਣੌਤੀਆਂ ਨੂੰ ਬਹੁਤ ਸ਼ਾਂਤੀ ਨਾਲ ਹੱਲ ਕਰਦਾ ਹਾਂ।", "attitude", false],
  [8, "I have the ability to solve problems that arise at work.", "ਮੇਰੇ ਵਿੱਚ ਕੰਮ ਦੌਰਾਨ ਆਉਣ ਵਾਲੀਆਂ ਸਮੱਸਿਆਵਾਂ ਹੱਲ ਕਰਨ ਦੀ ਯੋਗਤਾ ਹੈ।", "confidence", false],
  [9, "I take all the responsibilities in the absence of my senior.", "ਆਪਣੇ ਸੀਨੀਅਰ ਦੀ ਗ਼ੈਰ-ਹਾਜ਼ਰੀ ਵਿੱਚ ਮੈਂ ਸਾਰੀਆਂ ਜ਼ਿੰਮੇਵਾਰੀਆਂ ਸੰਭਾਲਦਾ ਹਾਂ।", "aggressive", false],
  [10, "I am careful when working with figures and records.", "ਅੰਕੜਿਆਂ ਅਤੇ ਰਿਕਾਰਡਾਂ ਨਾਲ ਕੰਮ ਕਰਦੇ ਸਮੇਂ ਮੈਂ ਸਾਵਧਾਨ ਰਹਿੰਦਾ ਹਾਂ।", "numeric", false],
  [11, "I develop my skills from time to time as needed for upcoming jobs.", "ਮੈਂ ਆਉਣ ਵਾਲੀਆਂ ਨੌਕਰੀਆਂ ਲਈ ਸਮੇਂ-ਸਮੇਂ 'ਤੇ ਆਪਣੇ ਹੁਨਰ ਵਿਕਸਿਤ ਕਰਦਾ ਹਾਂ।", "vision", false],
  [12, "I am not easily influenced when I observe social activities.", "ਸਮਾਜਿਕ ਗਤੀਵਿਧੀਆਂ ਦੇਖ ਕੇ ਮੈਂ ਆਸਾਨੀ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਨਹੀਂ ਹੁੰਦਾ।", "environment", false],
  [13, "I maintain a responsible attitude towards work.", "ਮੈਂ ਕੰਮ ਪ੍ਰਤੀ ਜ਼ਿੰਮੇਵਾਰ ਰਵੱਈਆ ਰੱਖਦਾ ਹਾਂ।", "attitude", false],
  [14, "I use the computer or internet as per my job requirements.", "ਮੈਂ ਆਪਣੇ ਕੰਮ ਦੀ ਲੋੜ ਅਨੁਸਾਰ ਕੰਪਿਊਟਰ ਜਾਂ ਇੰਟਰਨੈੱਟ ਵਰਤਦਾ ਹਾਂ।", "computer", false],
  [15, "I often get emotional when talking to friends and colleagues.", "ਦੋਸਤਾਂ ਅਤੇ ਸਹਿਕਰਮੀਆਂ ਨਾਲ ਗੱਲ ਕਰਦੇ ਸਮੇਂ ਮੈਂ ਅਕਸਰ ਭਾਵੁਕ ਹੋ ਜਾਂਦਾ ਹਾਂ।", "emotional", true],
  [16, "Even if I don't get a government job, I can still do some work.", "ਭਾਵੇਂ ਮੈਨੂੰ ਸਰਕਾਰੀ ਨੌਕਰੀ ਨਾ ਮਿਲੇ, ਮੈਂ ਫਿਰ ਵੀ ਕੋਈ ਕੰਮ ਕਰ ਸਕਦਾ ਹਾਂ।", "vision", false],
  [17, "I can talk to anyone without hesitation.", "ਮੈਂ ਬਿਨਾਂ ਝਿਜਕ ਕਿਸੇ ਨਾਲ ਵੀ ਗੱਲ ਕਰ ਸਕਦਾ ਹਾਂ।", "spoken", false],
  [18, "I speak confidently when presenting my education-related ideas.", "ਆਪਣੇ ਵਿਦਿਅਕ ਵਿਚਾਰ ਪੇਸ਼ ਕਰਦੇ ਸਮੇਂ ਮੈਂ ਆਤਮ-ਵਿਸ਼ਵਾਸ ਨਾਲ ਬੋਲਦਾ ਹਾਂ।", "spoken", false],
  [19, "I believe in traditional ways to achieve goals.", "ਮੈਂ ਟੀਚੇ ਹਾਸਲ ਕਰਨ ਲਈ ਰਵਾਇਤੀ ਤਰੀਕਿਆਂ ਵਿੱਚ ਵਿਸ਼ਵਾਸ ਰੱਖਦਾ ਹਾਂ।", "environment", true],
  [20, "I am aggressive when my views are challenged.", "ਜਦੋਂ ਮੇਰੇ ਵਿਚਾਰਾਂ ਨੂੰ ਚੁਣੌਤੀ ਮਿਲਦੀ ਹੈ ਤਾਂ ਮੈਂ ਹਮਲਾਵਰ ਹੋ ਜਾਂਦਾ ਹਾਂ।", "aggressive", false],
  [21, "I use polite language even during disagreements.", "ਮਤਭੇਦ ਦੌਰਾਨ ਵੀ ਮੈਂ ਨਿਮਰ ਭਾਸ਼ਾ ਵਰਤਦਾ ਹਾਂ।", "regard", false],
  [22, "I follow schedules and timelines strictly.", "ਮੈਂ ਸਮਾਂ-ਸਾਰਣੀ ਅਤੇ ਸਮਾਂ-ਸੀਮਾ ਦੀ ਸਖ਼ਤੀ ਨਾਲ ਪਾਲਣਾ ਕਰਦਾ ਹਾਂ।", "time", false],
  [23, "I adapt my behavior based on the social environment.", "ਮੈਂ ਸਮਾਜਿਕ ਮਾਹੌਲ ਅਨੁਸਾਰ ਆਪਣਾ ਵਿਹਾਰ ਢਾਲਦਾ ਹਾਂ।", "environment", false],
  [24, "I just believe in doing my job.", "ਮੈਂ ਸਿਰਫ਼ ਆਪਣਾ ਕੰਮ ਕਰਨ ਵਿੱਚ ਵਿਸ਼ਵਾਸ ਰੱਖਦਾ ਹਾਂ।", "attitude", false],
  [25, "I complete every task within the given time limits.", "ਮੈਂ ਹਰ ਕੰਮ ਦਿੱਤੇ ਸਮੇਂ ਅੰਦਰ ਪੂਰਾ ਕਰਦਾ ਹਾਂ।", "time", false],
  [26, "I do not do anything without the advice of my guardians and parents.", "ਮੈਂ ਆਪਣੇ ਮਾਪਿਆਂ ਅਤੇ ਸਰਪ੍ਰਸਤਾਂ ਦੀ ਸਲਾਹ ਤੋਂ ਬਿਨਾਂ ਕੁਝ ਨਹੀਂ ਕਰਦਾ।", "decision", true],
  [27, "I don't make any decisions based on anyone's opinions.", "ਮੈਂ ਕਿਸੇ ਦੀ ਰਾਏ ਦੇ ਆਧਾਰ 'ਤੇ ਕੋਈ ਫ਼ੈਸਲਾ ਨਹੀਂ ਲੈਂਦਾ।", "decision", false],
  [28, "I follow safety rules while working.", "ਕੰਮ ਕਰਦੇ ਸਮੇਂ ਮੈਂ ਸੁਰੱਖਿਆ ਨਿਯਮਾਂ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹਾਂ।", "regard", false],
  [29, "I choose multiple options before making a decision.", "ਫ਼ੈਸਲਾ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਮੈਂ ਕਈ ਵਿਕਲਪ ਵਿਚਾਰਦਾ ਹਾਂ।", "decision", false],
  [30, "I adapt myself according to the circumstances.", "ਮੈਂ ਹਾਲਾਤ ਅਨੁਸਾਰ ਆਪਣੇ ਆਪ ਨੂੰ ਢਾਲ ਲੈਂਦਾ ਹਾਂ।", "environment", false],
  [31, "I spend more time acquiring academic knowledge.", "ਮੈਂ ਵਿਦਿਅਕ ਗਿਆਨ ਹਾਸਲ ਕਰਨ ਵਿੱਚ ਵੱਧ ਸਮਾਂ ਲਗਾਉਂਦਾ ਹਾਂ।", "vision", false],
  [32, "I verify any problems with the help of Google.", "ਮੈਂ ਕਿਸੇ ਵੀ ਸਮੱਸਿਆ ਨੂੰ ਗੂਗਲ ਦੀ ਮਦਦ ਨਾਲ ਜਾਂਚਦਾ ਹਾਂ।", "computer", false],
  [33, "I don't postpone my work when I'm tired.", "ਥੱਕੇ ਹੋਣ 'ਤੇ ਵੀ ਮੈਂ ਆਪਣਾ ਕੰਮ ਟਾਲਦਾ ਨਹੀਂ।", "time", false],
  [34, "I quickly learn and apply new software or digital platforms.", "ਮੈਂ ਨਵੇਂ ਸਾਫ਼ਟਵੇਅਰ ਜਾਂ ਡਿਜੀਟਲ ਪਲੇਟਫਾਰਮ ਜਲਦੀ ਸਿੱਖ ਕੇ ਵਰਤ ਲੈਂਦਾ ਹਾਂ।", "computer", false],
  [35, "I maintain a positive mindset toward responsibilities and challenges.", "ਮੈਂ ਜ਼ਿੰਮੇਵਾਰੀਆਂ ਅਤੇ ਚੁਣੌਤੀਆਂ ਪ੍ਰਤੀ ਸਕਾਰਾਤਮਕ ਸੋਚ ਰੱਖਦਾ ਹਾਂ।", "attitude", false],
  [36, "I remain emotionally involved in social matters during my job.", "ਨੌਕਰੀ ਦੌਰਾਨ ਮੈਂ ਸਮਾਜਿਕ ਮਾਮਲਿਆਂ ਵਿੱਚ ਭਾਵਨਾਤਮਕ ਤੌਰ 'ਤੇ ਜੁੜਿਆ ਰਹਿੰਦਾ ਹਾਂ।", "emotional", true],
  [37, "I definitely count the payment made by someone in the office.", "ਦਫ਼ਤਰ ਵਿੱਚ ਕਿਸੇ ਵੱਲੋਂ ਕੀਤੀ ਅਦਾਇਗੀ ਨੂੰ ਮੈਂ ਜ਼ਰੂਰ ਗਿਣਦਾ ਹਾਂ।", "numeric", false],
  [38, "I make thoughtful decisions under pressure.", "ਦਬਾਅ ਹੇਠ ਵੀ ਮੈਂ ਸੋਚ-ਸਮਝ ਕੇ ਫ਼ੈਸਲੇ ਲੈਂਦਾ ਹਾਂ।", "decision", false],
  [39, "I think ahead about possible outcomes before starting any job.", "ਕੋਈ ਕੰਮ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਮੈਂ ਸੰਭਾਵੀ ਨਤੀਜਿਆਂ ਬਾਰੇ ਸੋਚਦਾ ਹਾਂ।", "vision", false],
  [40, "I can analyze numerical information without difficulty.", "ਮੈਂ ਸੰਖਿਆਤਮਕ ਜਾਣਕਾਰੀ ਦਾ ਆਸਾਨੀ ਨਾਲ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਸਕਦਾ ਹਾਂ।", "numeric", false],
  [41, "I make decisions keeping the future in mind.", "ਮੈਂ ਭਵਿੱਖ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖ ਕੇ ਫ਼ੈਸਲੇ ਲੈਂਦਾ ਹਾਂ।", "vision", false],
  [42, "I treat people with respect regardless of their position.", "ਮੈਂ ਅਹੁਦੇ ਦੀ ਪਰਵਾਹ ਕੀਤੇ ਬਿਨਾਂ ਲੋਕਾਂ ਨਾਲ ਸਤਿਕਾਰ ਨਾਲ ਪੇਸ਼ ਆਉਂਦਾ ਹਾਂ।", "regard", false],
  [43, "I take educational challenges as a proof of my capability.", "ਮੈਂ ਵਿਦਿਅਕ ਚੁਣੌਤੀਆਂ ਨੂੰ ਆਪਣੀ ਯੋਗਤਾ ਸਾਬਤ ਕਰਨ ਦੇ ਮੌਕੇ ਵਜੋਂ ਲੈਂਦਾ ਹਾਂ।", "aggressive", false],
  [44, "I don't know how to control my emotions in the right way at the right time.", "ਮੈਨੂੰ ਨਹੀਂ ਪਤਾ ਕਿ ਸਹੀ ਸਮੇਂ 'ਤੇ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਆਪਣੀਆਂ ਭਾਵਨਾਵਾਂ ਨੂੰ ਕਿਵੇਂ ਕਾਬੂ ਕਰਨਾ ਹੈ।", "emotional", true],
  [45, "When I'm working on computers, I don't do anything else.", "ਜਦੋਂ ਮੈਂ ਕੰਪਿਊਟਰ 'ਤੇ ਕੰਮ ਕਰਦਾ ਹਾਂ ਤਾਂ ਹੋਰ ਕੁਝ ਨਹੀਂ ਕਰਦਾ।", "computer", false],
  [46, "I have clarity about what I want to achieve.", "ਮੈਨੂੰ ਸਪਸ਼ਟ ਹੈ ਕਿ ਮੈਂ ਕੀ ਹਾਸਲ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।", "vision", false],
  [47, "I am confident in my ability to learn any skill.", "ਮੈਨੂੰ ਆਪਣੀ ਕੋਈ ਵੀ ਹੁਨਰ ਸਿੱਖਣ ਦੀ ਯੋਗਤਾ 'ਤੇ ਭਰੋਸਾ ਹੈ।", "confidence", false],
  [48, "I use art to express my feelings.", "ਮੈਂ ਆਪਣੀਆਂ ਭਾਵਨਾਵਾਂ ਨੂੰ ਪ੍ਰਗਟ ਕਰਨ ਲਈ ਕਲਾ ਵਰਤਦਾ ਹਾਂ।", "spoken", false],
  [49, "I communicate clearly during social discussions with people.", "ਲੋਕਾਂ ਨਾਲ ਸਮਾਜਿਕ ਚਰਚਾ ਦੌਰਾਨ ਮੈਂ ਸਪਸ਼ਟ ਤਰੀਕੇ ਨਾਲ ਗੱਲ ਕਰਦਾ ਹਾਂ।", "spoken", false],
  [50, "I never quit my responsibility even when the situation worsens.", "ਹਾਲਾਤ ਵਿਗੜਨ 'ਤੇ ਵੀ ਮੈਂ ਆਪਣੀ ਜ਼ਿੰਮੇਵਾਰੀ ਤੋਂ ਪਿੱਛੇ ਨਹੀਂ ਹਟਦਾ।", "confidence", false],
];

// --- STUDENT test (Multiple Intelligences, 70 statements, 1–4 scale) ---
const STUDENT_QUESTIONS: [number, string, string][] = [
  [1, "I like to learn more about myself", "ਮੈਨੂੰ ਆਪਣੇ ਬਾਰੇ ਹੋਰ ਜਾਣਨਾ ਪਸੰਦ ਹੈ।"],
  [2, "I can play a musical instrument", "ਮੈਂ ਕੋਈ ਸੰਗੀਤਕ ਸਾਜ਼ ਵਜਾ ਸਕਦਾ ਹਾਂ।"],
  [3, "I find it easiest to solve problems when I am doing something physical", "ਜਦੋਂ ਮੈਂ ਕੋਈ ਸਰੀਰਕ ਕੰਮ ਕਰ ਰਿਹਾ ਹੋਵਾਂ ਤਾਂ ਮੈਨੂੰ ਸਮੱਸਿਆਵਾਂ ਹੱਲ ਕਰਨੀਆਂ ਸੌਖੀਆਂ ਲੱਗਦੀਆਂ ਹਨ।"],
  [4, "I often have a song or piece of music in my head", "ਮੇਰੇ ਮਨ ਵਿੱਚ ਅਕਸਰ ਕੋਈ ਗੀਤ ਜਾਂ ਧੁਨ ਚੱਲਦੀ ਰਹਿੰਦੀ ਹੈ।"],
  [5, "I find budgeting and managing my money easy", "ਮੈਨੂੰ ਬਜਟ ਬਣਾਉਣਾ ਅਤੇ ਪੈਸੇ ਸੰਭਾਲਣੇ ਸੌਖੇ ਲੱਗਦੇ ਹਨ।"],
  [6, "I find it easy to make up stories", "ਮੈਨੂੰ ਕਹਾਣੀਆਂ ਘੜਨੀਆਂ ਸੌਖੀਆਂ ਲੱਗਦੀਆਂ ਹਨ।"],
  [7, "I have always been very co-ordinated", "ਮੈਂ ਹਮੇਸ਼ਾ ਸਰੀਰਕ ਤੌਰ 'ਤੇ ਚੰਗੀ ਤਰ੍ਹਾਂ ਤਾਲਮੇਲ ਵਾਲਾ ਰਿਹਾ ਹਾਂ।"],
  [8, "When talking to someone, I tend to listen to the words they use, not just what they mean", "ਕਿਸੇ ਨਾਲ ਗੱਲ ਕਰਦੇ ਸਮੇਂ ਮੈਂ ਉਹਨਾਂ ਦੇ ਵਰਤੇ ਸ਼ਬਦਾਂ ਵੱਲ ਧਿਆਨ ਦਿੰਦਾ ਹਾਂ, ਨਾ ਕਿ ਸਿਰਫ਼ ਅਰਥ ਵੱਲ।"],
  [9, "I enjoy crosswords, word searches or other word puzzles", "ਮੈਨੂੰ ਸ਼ਬਦ ਬੁਝਾਰਤਾਂ ਅਤੇ ਸ਼ਬਦ ਖੇਡਾਂ ਪਸੰਦ ਹਨ।"],
  [10, "I don't like ambiguity, I like things to be clear", "ਮੈਨੂੰ ਅਸਪਸ਼ਟਤਾ ਪਸੰਦ ਨਹੀਂ, ਮੈਨੂੰ ਚੀਜ਼ਾਂ ਸਪਸ਼ਟ ਚਾਹੀਦੀਆਂ ਹਨ।"],
  [11, "I enjoy logic puzzles such as 'sudoku'", "ਮੈਨੂੰ ਸੁਡੋਕੂ ਵਰਗੀਆਂ ਤਰਕ ਬੁਝਾਰਤਾਂ ਪਸੰਦ ਹਨ।"],
  [12, "I like to meditate", "ਮੈਨੂੰ ਧਿਆਨ (ਮੈਡੀਟੇਸ਼ਨ) ਕਰਨਾ ਪਸੰਦ ਹੈ।"],
  [13, "Music is very important to me", "ਸੰਗੀਤ ਮੇਰੇ ਲਈ ਬਹੁਤ ਮਹੱਤਵਪੂਰਨ ਹੈ।"],
  [14, "I am a convincing liar", "ਮੈਂ ਯਕੀਨ ਦਿਵਾਉਣ ਵਾਲਾ ਝੂਠ ਬੋਲ ਸਕਦਾ ਹਾਂ।"],
  [15, "I play a sport or dance", "ਮੈਂ ਕੋਈ ਖੇਡ ਖੇਡਦਾ ਹਾਂ ਜਾਂ ਨੱਚਦਾ ਹਾਂ।"],
  [16, "I am very interested in psychometrics (personality testing) and IQ tests", "ਮੈਨੂੰ ਮਨੋਮਾਪ (ਸ਼ਖਸੀਅਤ ਜਾਂਚ) ਅਤੇ ਆਈ.ਕਿਊ. ਟੈਸਟਾਂ ਵਿੱਚ ਬਹੁਤ ਦਿਲਚਸਪੀ ਹੈ।"],
  [17, "People behaving irrationally annoy me", "ਤਰਕਹੀਣ ਵਿਹਾਰ ਕਰਨ ਵਾਲੇ ਲੋਕ ਮੈਨੂੰ ਖਿਝਾਉਂਦੇ ਹਨ।"],
  [18, "I find that the music that appeals to me is often based on how I feel emotionally", "ਮੈਨੂੰ ਜੋ ਸੰਗੀਤ ਪਸੰਦ ਆਉਂਦਾ ਹੈ ਉਹ ਅਕਸਰ ਮੇਰੀਆਂ ਭਾਵਨਾਵਾਂ 'ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।"],
  [19, "I am a very social person and like being with other people", "ਮੈਂ ਬਹੁਤ ਸਮਾਜਿਕ ਹਾਂ ਅਤੇ ਲੋਕਾਂ ਨਾਲ ਰਹਿਣਾ ਪਸੰਦ ਕਰਦਾ ਹਾਂ।"],
  [20, "I like to be systematic and thorough", "ਮੈਂ ਵਿਵਸਥਿਤ ਅਤੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਧਿਆਨ ਦੇਣ ਵਾਲਾ ਬਣਨਾ ਪਸੰਦ ਕਰਦਾ ਹਾਂ।"],
  [21, "I find graphs and charts easy to understand", "ਮੈਨੂੰ ਗ੍ਰਾਫ਼ ਅਤੇ ਚਾਰਟ ਸਮਝਣੇ ਸੌਖੇ ਲੱਗਦੇ ਹਨ।"],
  [22, "I can throw things well - darts, skimming pebbles, frisbees, etc.", "ਮੈਂ ਚੀਜ਼ਾਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸੁੱਟ ਸਕਦਾ ਹਾਂ - ਡਾਰਟ, ਪੱਥਰ, ਫ੍ਰਿਸਬੀ ਆਦਿ।"],
  [23, "I find it easy to remember quotes or phrases", "ਮੈਨੂੰ ਕਥਨ ਜਾਂ ਵਾਕ ਯਾਦ ਰੱਖਣੇ ਸੌਖੇ ਲੱਗਦੇ ਹਨ।"],
  [24, "I can always recognise places that I have been before, even when I was very young", "ਮੈਂ ਉਹ ਥਾਵਾਂ ਹਮੇਸ਼ਾ ਪਛਾਣ ਲੈਂਦਾ ਹਾਂ ਜਿੱਥੇ ਮੈਂ ਪਹਿਲਾਂ ਗਿਆ ਹੋਵਾਂ, ਭਾਵੇਂ ਮੈਂ ਬਹੁਤ ਛੋਟਾ ਸੀ।"],
  [25, "I enjoy a wide variety of musical styles", "ਮੈਨੂੰ ਕਈ ਤਰ੍ਹਾਂ ਦੇ ਸੰਗੀਤ ਪਸੰਦ ਹਨ।"],
  [26, "When I am concentrating I tend to doodle", "ਜਦੋਂ ਮੈਂ ਧਿਆਨ ਕੇਂਦਰਿਤ ਕਰਦਾ ਹਾਂ ਤਾਂ ਮੈਂ ਅਕਸਰ ਚਿੱਤਰ ਬਣਾਉਂਦਾ ਰਹਿੰਦਾ ਹਾਂ।"],
  [27, "I could manipulate people if I choose to", "ਜੇ ਮੈਂ ਚਾਹਾਂ ਤਾਂ ਮੈਂ ਲੋਕਾਂ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦਾ ਹਾਂ।"],
  [28, "I can predict my feelings and behaviours in certain situations fairly accurately", "ਮੈਂ ਕੁਝ ਹਾਲਾਤਾਂ ਵਿੱਚ ਆਪਣੀਆਂ ਭਾਵਨਾਵਾਂ ਅਤੇ ਵਿਹਾਰ ਦਾ ਕਾਫ਼ੀ ਸਹੀ ਅੰਦਾਜ਼ਾ ਲਗਾ ਸਕਦਾ ਹਾਂ।"],
  [29, "I find mental arithmetic easy", "ਮੈਨੂੰ ਮਨ ਵਿੱਚ ਹਿਸਾਬ ਕਰਨਾ ਸੌਖਾ ਲੱਗਦਾ ਹੈ।"],
  [30, "I can identify most sounds without seeing what causes them", "ਮੈਂ ਬਹੁਤੀਆਂ ਆਵਾਜ਼ਾਂ ਨੂੰ ਉਹਨਾਂ ਦਾ ਸਰੋਤ ਵੇਖੇ ਬਿਨਾਂ ਪਛਾਣ ਸਕਦਾ ਹਾਂ।"],
  [31, "At school one of my favourite subjects is / was English", "ਸਕੂਲ ਵਿੱਚ ਮੇਰਾ ਇੱਕ ਪਸੰਦੀਦਾ ਵਿਸ਼ਾ ਅੰਗਰੇਜ਼ੀ ਹੈ/ਸੀ।"],
  [32, "I like to think through a problem carefully, considering all the consequences", "ਮੈਂ ਸਾਰੇ ਨਤੀਜਿਆਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖ ਕੇ ਕਿਸੇ ਸਮੱਸਿਆ ਬਾਰੇ ਧਿਆਨ ਨਾਲ ਸੋਚਣਾ ਪਸੰਦ ਕਰਦਾ ਹਾਂ।"],
  [33, "I enjoy debates and discussions", "ਮੈਨੂੰ ਬਹਿਸ ਅਤੇ ਚਰਚਾ ਪਸੰਦ ਹੈ।"],
  [34, "I love adrenaline sports and scary rides", "ਮੈਨੂੰ ਰੋਮਾਂਚਕ ਖੇਡਾਂ ਅਤੇ ਡਰਾਉਣੀਆਂ ਰਾਈਡਾਂ ਪਸੰਦ ਹਨ।"],
  [35, "I enjoy individual sports best", "ਮੈਨੂੰ ਇਕੱਲੇ ਖੇਡੀਆਂ ਜਾਣ ਵਾਲੀਆਂ ਖੇਡਾਂ ਸਭ ਤੋਂ ਵੱਧ ਪਸੰਦ ਹਨ।"],
  [36, "I care about how those around me feel", "ਮੈਨੂੰ ਪਰਵਾਹ ਹੈ ਕਿ ਮੇਰੇ ਆਲੇ-ਦੁਆਲੇ ਦੇ ਲੋਕ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰਦੇ ਹਨ।"],
  [37, "My house is full of pictures and photographs", "ਮੇਰਾ ਘਰ ਤਸਵੀਰਾਂ ਅਤੇ ਫੋਟੋਆਂ ਨਾਲ ਭਰਿਆ ਹੈ।"],
  [38, "I enjoy and am good at making things - I'm good with my hands", "ਮੈਨੂੰ ਚੀਜ਼ਾਂ ਬਣਾਉਣੀਆਂ ਪਸੰਦ ਹਨ ਅਤੇ ਮੈਂ ਇਸ ਵਿੱਚ ਮਾਹਰ ਹਾਂ - ਮੇਰੇ ਹੱਥ ਚੰਗੇ ਚੱਲਦੇ ਹਨ।"],
  [39, "I like having music on in the background", "ਮੈਨੂੰ ਪਿੱਛੇ ਸੰਗੀਤ ਚੱਲਦਾ ਰਹਿਣਾ ਪਸੰਦ ਹੈ।"],
  [40, "I find it easy to remember telephone numbers", "ਮੈਨੂੰ ਟੈਲੀਫੋਨ ਨੰਬਰ ਯਾਦ ਰੱਖਣੇ ਸੌਖੇ ਲੱਗਦੇ ਹਨ।"],
  [41, "I set myself goals and plans for the future", "ਮੈਂ ਆਪਣੇ ਭਵਿੱਖ ਲਈ ਟੀਚੇ ਅਤੇ ਯੋਜਨਾਵਾਂ ਬਣਾਉਂਦਾ ਹਾਂ।"],
  [42, "I am a very tactile person", "ਮੈਂ ਛੂਹ ਕੇ ਮਹਿਸੂਸ ਕਰਨ ਵਾਲਾ ਵਿਅਕਤੀ ਹਾਂ।"],
  [43, "I can tell easily whether someone likes me or dislikes me", "ਮੈਂ ਆਸਾਨੀ ਨਾਲ ਜਾਣ ਲੈਂਦਾ ਹਾਂ ਕਿ ਕੋਈ ਮੈਨੂੰ ਪਸੰਦ ਕਰਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।"],
  [44, "I can easily imagine how an object would look from another perspective", "ਮੈਂ ਆਸਾਨੀ ਨਾਲ ਕਲਪਨਾ ਕਰ ਸਕਦਾ ਹਾਂ ਕਿ ਕੋਈ ਵਸਤੂ ਕਿਸੇ ਹੋਰ ਪਾਸਿਓਂ ਕਿਵੇਂ ਦਿਸੇਗੀ।"],
  [45, "I never use instructions for flat-pack furniture", "ਮੈਂ ਫਰਨੀਚਰ ਜੋੜਨ ਲਈ ਕਦੇ ਹਦਾਇਤਾਂ ਨਹੀਂ ਵਰਤਦਾ।"],
  [46, "I find it easy to talk to new people", "ਮੈਨੂੰ ਨਵੇਂ ਲੋਕਾਂ ਨਾਲ ਗੱਲ ਕਰਨੀ ਸੌਖੀ ਲੱਗਦੀ ਹੈ।"],
  [47, "To learn something new, I need to just get on and try it", "ਕੁਝ ਨਵਾਂ ਸਿੱਖਣ ਲਈ ਮੈਨੂੰ ਬਸ ਇਸ ਨੂੰ ਕਰਕੇ ਅਜ਼ਮਾਉਣਾ ਪੈਂਦਾ ਹੈ।"],
  [48, "I often see clear images when I close my eyes", "ਅੱਖਾਂ ਬੰਦ ਕਰਨ 'ਤੇ ਮੈਨੂੰ ਅਕਸਰ ਸਪਸ਼ਟ ਚਿੱਤਰ ਦਿਸਦੇ ਹਨ।"],
  [49, "I don't use my fingers when I count", "ਗਿਣਤੀ ਕਰਦੇ ਸਮੇਂ ਮੈਂ ਉਂਗਲਾਂ ਨਹੀਂ ਵਰਤਦਾ।"],
  [50, "I often talk to myself – out loud or in my head", "ਮੈਂ ਅਕਸਰ ਆਪਣੇ ਆਪ ਨਾਲ ਗੱਲ ਕਰਦਾ ਹਾਂ - ਉੱਚੀ ਜਾਂ ਮਨ ਵਿੱਚ।"],
  [51, "At school I loved / love music lessons", "ਸਕੂਲ ਵਿੱਚ ਮੈਨੂੰ ਸੰਗੀਤ ਦੀਆਂ ਕਲਾਸਾਂ ਪਸੰਦ ਸਨ/ਹਨ।"],
  [52, "When I am abroad, I find it easy to pick up the basics of another language", "ਵਿਦੇਸ਼ ਵਿੱਚ ਮੈਨੂੰ ਕਿਸੇ ਹੋਰ ਭਾਸ਼ਾ ਦੀਆਂ ਮੁੱਢਲੀਆਂ ਗੱਲਾਂ ਸਿੱਖਣੀਆਂ ਸੌਖੀਆਂ ਲੱਗਦੀਆਂ ਹਨ।"],
  [53, "I find ball games easy and enjoyable", "ਮੈਨੂੰ ਗੇਂਦ ਵਾਲੀਆਂ ਖੇਡਾਂ ਸੌਖੀਆਂ ਅਤੇ ਮਜ਼ੇਦਾਰ ਲੱਗਦੀਆਂ ਹਨ।"],
  [54, "My favourite subject at school is / was maths", "ਸਕੂਲ ਵਿੱਚ ਮੇਰਾ ਪਸੰਦੀਦਾ ਵਿਸ਼ਾ ਗਣਿਤ ਹੈ/ਸੀ।"],
  [55, "I always know how I am feeling", "ਮੈਨੂੰ ਹਮੇਸ਼ਾ ਪਤਾ ਹੁੰਦਾ ਹੈ ਕਿ ਮੈਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਿਹਾ ਹਾਂ।"],
  [56, "I am realistic about my strengths and weaknesses", "ਮੈਂ ਆਪਣੀਆਂ ਖੂਬੀਆਂ ਅਤੇ ਕਮਜ਼ੋਰੀਆਂ ਬਾਰੇ ਯਥਾਰਥਵਾਦੀ ਹਾਂ।"],
  [57, "I keep a diary", "ਮੈਂ ਡਾਇਰੀ ਲਿਖਦਾ ਹਾਂ।"],
  [58, "I am very aware of other people's body language", "ਮੈਂ ਦੂਜਿਆਂ ਦੀ ਸਰੀਰਕ ਭਾਸ਼ਾ ਪ੍ਰਤੀ ਬਹੁਤ ਸੁਚੇਤ ਹਾਂ।"],
  [59, "My favourite subject at school was / is art", "ਸਕੂਲ ਵਿੱਚ ਮੇਰਾ ਪਸੰਦੀਦਾ ਵਿਸ਼ਾ ਕਲਾ ਸੀ/ਹੈ।"],
  [60, "I find pleasure in reading", "ਮੈਨੂੰ ਪੜ੍ਹਨ ਵਿੱਚ ਆਨੰਦ ਆਉਂਦਾ ਹੈ।"],
  [61, "I can read a map easily", "ਮੈਂ ਨਕਸ਼ਾ ਆਸਾਨੀ ਨਾਲ ਪੜ੍ਹ ਸਕਦਾ ਹਾਂ।"],
  [62, "It upsets me to see someone cry and not be able to help", "ਕਿਸੇ ਨੂੰ ਰੋਂਦਾ ਵੇਖ ਕੇ ਮਦਦ ਨਾ ਕਰ ਸਕਣ 'ਤੇ ਮੈਨੂੰ ਦੁੱਖ ਹੁੰਦਾ ਹੈ।"],
  [63, "I am good at solving disputes between others", "ਮੈਂ ਦੂਜਿਆਂ ਦੇ ਝਗੜੇ ਸੁਲਝਾਉਣ ਵਿੱਚ ਚੰਗਾ ਹਾਂ।"],
  [64, "I have always dreamed of being a musician or singer", "ਮੈਂ ਹਮੇਸ਼ਾ ਸੰਗੀਤਕਾਰ ਜਾਂ ਗਾਇਕ ਬਣਨ ਦਾ ਸੁਪਨਾ ਵੇਖਿਆ ਹੈ।"],
  [65, "I prefer team sports", "ਮੈਨੂੰ ਟੀਮ ਖੇਡਾਂ ਜ਼ਿਆਦਾ ਪਸੰਦ ਹਨ।"],
  [66, "Singing makes me feel happy", "ਗਾਉਣ ਨਾਲ ਮੈਨੂੰ ਖੁਸ਼ੀ ਮਿਲਦੀ ਹੈ।"],
  [67, "I never get lost when I am on my own in a new place", "ਨਵੀਂ ਥਾਂ 'ਤੇ ਇਕੱਲੇ ਹੋਣ 'ਤੇ ਵੀ ਮੈਂ ਕਦੇ ਨਹੀਂ ਗੁਆਚਦਾ।"],
  [68, "If I am learning how to do something, I like to see drawings and diagrams of how it works", "ਕੁਝ ਸਿੱਖਣ ਵੇਲੇ ਮੈਨੂੰ ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ, ਉਸ ਦੇ ਚਿੱਤਰ ਅਤੇ ਡਾਇਗ੍ਰਾਮ ਵੇਖਣੇ ਪਸੰਦ ਹਨ।"],
  [69, "I am happy spending time alone", "ਮੈਂ ਇਕੱਲੇ ਸਮਾਂ ਬਿਤਾ ਕੇ ਖੁਸ਼ ਰਹਿੰਦਾ ਹਾਂ।"],
  [70, "My friends always come to me for emotional support and advice", "ਮੇਰੇ ਦੋਸਤ ਭਾਵਨਾਤਮਕ ਸਹਾਰੇ ਅਤੇ ਸਲਾਹ ਲਈ ਹਮੇਸ਼ਾ ਮੇਰੇ ਕੋਲ ਆਉਂਦੇ ਹਨ।"],
];

const CONTENT_BLOCKS = [
  { key: "hero", title: "Scientific Career Guidance for Every Indian Student & Professional", body: "A trusted psychometric assessment platform for schools, companies and individuals — mapping aptitude, intelligence and career interests into a clear, professional report." },
  { key: "contact_info", title: "Talk to our team", body: "Email: hello@mindmetric.in | Phone: +91 90419 97889 | Address: SBS College Road, Kotkapura, Punjab" },
];

const PRICING = [
  { key: "student", label: "Student Test (Class 9–10) — Multiple Intelligence", amount: 499 },
  { key: "employee", label: "Employee / Self Assessment Test", amount: 799 },
  { key: "parent", label: "Parent for Child Assessment", amount: 599 },
];

async function main() {
  console.log("Seeding database...");

  const adminPass = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@mindmetric.in" },
    update: {},
    create: { name: "Super Admin", email: "admin@mindmetric.in", passwordHash: adminPass, role: "superadmin", permissions: "[]", active: true },
  });

  const schoolPass = await bcrypt.hash("school123", 10);
  const school = await prisma.school.upsert({
    where: { code: "DEMO01" },
    update: {},
    create: { name: "Jyoti Model Sen Sec School", code: "DEMO01", email: "school@demo.in", passwordHash: schoolPass, phone: "9041997889", city: "Kotkapura", state: "Punjab", address: "Near SBS College Road, Kotkapura", principal: "Principal Sahib", status: "approved" },
  });

  const companyPass = await bcrypt.hash("company123", 10);
  await prisma.company.upsert({
    where: { code: "CORP01" },
    update: {},
    create: { name: "Acme Technologies Pvt Ltd", code: "CORP01", email: "hr@acme.in", passwordHash: companyPass, phone: "9876500000", city: "Mohali", state: "Punjab", contactPerson: "HR Manager", industry: "IT Services", status: "approved" },
  });

  const userPass = await bcrypt.hash("user123", 10);
  await prisma.individualUser.upsert({
    where: { email: "user@demo.in" },
    update: {},
    create: { name: "Demo User", email: "user@demo.in", passwordHash: userPass, phone: "9000000000", city: "Patiala" },
  });

  const centrePass = await bcrypt.hash("centre123", 10);
  await prisma.studyCentre.upsert({
    where: { code: "AC001" },
    update: {},
    create: {
      name: "Bright Future Study Centre", code: "AC001", email: "centre@demo.in",
      passwordHash: centrePass, ownerName: "Rajiv Mehta", mobile: "9123456780",
      city: "Bathinda", district: "Bathinda", state: "Punjab",
      address: "Model Town, Bathinda, Punjab", existingInstitute: "Bright Future Coaching",
      registrationType: "Proprietorship", expectedStudents: 50,
      commissionPercent: 30, status: "active",
    },
  });

  // Employee questions
  for (const [order, textEn, textPa, skill, reverse] of EMPLOYEE_QUESTIONS) {
    await prisma.question.upsert({
      where: { testType_order: { testType: "employee", order } },
      update: { textEn, textPa, skill, reverse, scaleMax: 5, testType: "employee" },
      create: { testType: "employee", order, textEn, textPa, skill, reverse, scaleMax: 5, active: true },
    });
  }

  // Student MI questions
  for (const [order, textEn, textPa] of STUDENT_QUESTIONS) {
    const intelligence = STUDENT_QUESTION_MAP[order];
    await prisma.question.upsert({
      where: { testType_order: { testType: "student", order } },
      update: { textEn, textPa, intelligence, scaleMax: 4, testType: "student" },
      create: { testType: "student", order, textEn, textPa, intelligence, skill: "", reverse: false, scaleMax: 4, active: true },
    });
  }

  for (const r of RIASEC) {
    const c = RIASEC_CONTENT[r.key];
    await prisma.careerSuggestion.upsert({
      where: { type: r.key },
      update: { label: r.label, fields: c.fields, traits: c.traits, formula: c.formula },
      create: { type: r.key, label: r.label, fields: c.fields, traits: c.traits, formula: c.formula },
    });
  }

  for (const b of CONTENT_BLOCKS) {
    await prisma.contentBlock.upsert({ where: { key: b.key }, update: { title: b.title, body: b.body }, create: b });
  }

  for (const p of PRICING) {
    await prisma.pricing.upsert({ where: { key: p.key }, update: { label: p.label, amount: p.amount }, create: { ...p, active: true } });
  }

  // Joining-fee / payment settings
  const SETTINGS: [string, string][] = [
    ["joining_fee", "5000"],
    ["upi_id", "amgeducations@upi"],
    ["upi_name", "AMG Educational Charitable Society"],
    ["qr_image", ""],
  ];
  for (const [key, value] of SETTINGS) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  const existing = await prisma.student.findFirst({ where: { schoolId: school.id, name: "Manav" } });
  if (!existing) {
    await prisma.student.create({
      data: { schoolId: school.id, name: "Manav", fatherName: "Vijay Kumar", motherName: "Neelam Rani", mobile: "6284509102", dob: "30/09/2009", classCourse: "10th", schoolNameRaw: "Jyoti Model Sen Sec School", address: "Kotkapura", category: "GEN", aim: "Engineer", venue: "Kotkapura" },
    });
  }

  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    await prisma.lead.createMany({
      data: [
        { type: "enroll", name: "Gurpreet Singh", email: "gurpreet@school.in", phone: "9876543210", school: "Govt Sen Sec School Moga", city: "Moga", message: "We would like to enroll 200 students." },
        { type: "company", name: "Acme HR", email: "hr@acme.in", phone: "9988776655", city: "Mohali", message: "We want to assess 50 employees." },
      ],
    });
  }

  console.log("Seed complete.");
  console.log("  Super Admin -> admin@mindmetric.in / admin123");
  console.log("  School      -> DEMO01 / school123");
  console.log("  Company     -> CORP01 / company123");
  console.log("  Individual  -> user@demo.in / user123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
