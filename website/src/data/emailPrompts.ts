export interface EmailPrompt {
  id: string;
  title: string;
  scenario: string;
  keyPoints: string[];
  category: 'professional' | 'complaint' | 'request' | 'apology' | 'inquiry' | 'banking';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const emailPrompts: EmailPrompt[] = [
  {
    id: 'e1',
    title: 'Request for Leave Extension',
    scenario: 'You are an employee at a software company. You had applied for 5 days of casual leave for a family event, but due to an emergency, you need to extend your leave by 3 more days. Write a professional email to your manager requesting this extension.',
    keyPoints: ['Mention original leave dates', 'Explain the emergency briefly', 'Request for 3-day extension', 'Assure your responsibilities are covered', 'Express gratitude'],
    category: 'request',
    difficulty: 'easy'
  },
  {
    id: 'e2',
    title: 'Complaint About Defective Product',
    scenario: 'You purchased a laptop from an online store two weeks ago, but it has been malfunctioning since the first day. Despite multiple attempts to contact customer support, the issue remains unresolved. Write a formal complaint email to the Customer Relations Manager.',
    keyPoints: ['State order details and purchase date', 'Describe the defect clearly', 'Mention previous support attempts', 'State your expected resolution', 'Set a reasonable deadline'],
    category: 'complaint',
    difficulty: 'medium'
  },
  {
    id: 'e3',
    title: 'Bank Loan Inquiry',
    scenario: 'You are planning to start a small business and need financial assistance. Write a formal email to the branch manager of your bank inquiring about business loan options, interest rates, eligibility criteria, and the application process.',
    keyPoints: ['Introduce yourself as an existing customer', 'State your business plan briefly', 'Inquire about loan types and amounts', 'Ask about interest rates and tenure', 'Request an appointment'],
    category: 'banking',
    difficulty: 'medium'
  },
  {
    id: 'e4',
    title: 'Apology for Missing Deadline',
    scenario: 'You are a project coordinator who failed to deliver an important report by the agreed deadline due to unforeseen data collection issues. Write an apology email to your client explaining the situation and providing a new timeline.',
    keyPoints: ['Apologize sincerely at the outset', 'Explain the reason without making excuses', 'Acknowledge the inconvenience caused', 'Provide a revised and realistic deadline', 'Offer assurance this will not recur'],
    category: 'apology',
    difficulty: 'medium'
  },
  {
    id: 'e5',
    title: 'Job Application Follow-Up',
    scenario: 'You applied for a software developer position at a technology company three weeks ago and have not received any response. Write a polite follow-up email to the hiring manager expressing your continued interest in the position.',
    keyPoints: ['Reference your original application date and position', 'Restate your enthusiasm for the role', 'Briefly highlight your key qualifications', 'Inquire about the current status', 'Thank them for their time'],
    category: 'professional',
    difficulty: 'easy'
  },
  {
    id: 'e6',
    title: 'Vendor Payment Dispute',
    scenario: 'Your company received an invoice from a vendor that includes charges for services that were not part of the original agreement. Write a professional email to the vendor\'s accounts department disputing the additional charges.',
    keyPoints: ['Reference the original contract or agreement', 'Identify the disputed charges specifically', 'Provide supporting documentation', 'Request a revised invoice', 'Maintain a professional, non-confrontational tone'],
    category: 'complaint',
    difficulty: 'hard'
  },
  {
    id: 'e7',
    title: 'Request for Salary Certificate',
    scenario: 'You need a salary certificate from your HR department for a home loan application at a bank. Write a formal email to your HR Manager requesting the document, specifying the purpose and urgency.',
    keyPoints: ['State your employee ID and designation', 'Explain the purpose (home loan)', 'Specify the required format if any', 'Mention the deadline you need it by', 'Express appreciation in advance'],
    category: 'request',
    difficulty: 'easy'
  },
  {
    id: 'e8',
    title: 'Proposal for Remote Work Policy',
    scenario: 'You are a senior employee who wants to propose a hybrid work-from-home policy for your team to improve productivity and work-life balance. Write a persuasive email to your department head outlining the proposal.',
    keyPoints: ['Present data or examples supporting remote work benefits', 'Propose a specific hybrid model (days in office/remote)', 'Address potential concerns proactively', 'Suggest a trial period', 'Request a meeting to discuss'],
    category: 'professional',
    difficulty: 'hard'
  },
  {
    id: 'e9',
    title: 'Account Closure Request',
    scenario: 'You wish to close one of your savings accounts at a bank as you are relocating to another city. Write a formal email to the bank manager requesting account closure and asking about the procedure and timeline.',
    keyPoints: ['Provide account details', 'State the reason for closure', 'Ask about the closure procedure', 'Inquire about pending transactions or charges', 'Request confirmation in writing'],
    category: 'banking',
    difficulty: 'easy'
  },
  {
    id: 'e10',
    title: 'Feedback on Training Program',
    scenario: 'You recently attended a three-day professional development training organized by your company. Write an email to the Learning and Development team providing constructive feedback about the program, highlighting both strengths and areas for improvement.',
    keyPoints: ['Mention specific sessions or modules', 'Highlight what was effective and why', 'Suggest specific improvements', 'Comment on logistics and materials', 'Offer to participate in future programs'],
    category: 'professional',
    difficulty: 'medium'
  },
  {
    id: 'e11',
    title: 'Escalation of Unresolved IT Issue',
    scenario: 'You have been facing a critical software issue for the past week that is affecting your productivity and work deliverables. Despite raising a ticket, no resolution has been provided. Write an escalation email to the IT Manager.',
    keyPoints: ['Reference the original ticket number and date', 'Describe the impact on work output', 'List the steps already taken', 'Express urgency clearly', 'Request immediate escalation and timeline'],
    category: 'complaint',
    difficulty: 'medium'
  },
  {
    id: 'e12',
    title: 'Partnership Proposal',
    scenario: 'You represent a growing edtech startup and wish to propose a strategic partnership with an established educational institution to co-develop online certification courses. Write a formal introductory email to the institution\'s Director of Academics.',
    keyPoints: ['Introduce your company and its mission', 'Explain the partnership concept', 'Highlight mutual benefits', 'Provide brief credentials or social proof', 'Propose a discovery call or meeting'],
    category: 'inquiry',
    difficulty: 'hard'
  }
];
