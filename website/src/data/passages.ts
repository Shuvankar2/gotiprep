export interface Passage {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'tech' | 'banking' | 'current-affairs' | 'science';
  difficulty: 'easy' | 'medium' | 'hard';
  wordCount: number;
}

export const passages: Passage[] = [
  {
    id: 'p1',
    title: 'The Digital Revolution',
    category: 'tech',
    difficulty: 'medium',
    wordCount: 120,
    content: `The digital revolution has fundamentally transformed the way humans interact with information. From the earliest days of computing, when machines occupied entire rooms, to today's pocket-sized devices that contain more processing power than was available to entire nations just decades ago, technology has advanced at a breathtaking pace. The internet, once a niche academic tool, has become the backbone of modern civilization, connecting billions of people across continents and enabling instant communication, commerce, and collaboration on an unprecedented scale. Artificial intelligence, cloud computing, and mobile technology continue to reshape industries, disrupt traditional business models, and create entirely new economic opportunities that were unimaginable just a generation ago.`
  },
  {
    id: 'p2',
    title: 'Climate Change and Our Future',
    category: 'current-affairs',
    difficulty: 'medium',
    wordCount: 115,
    content: `Climate change represents one of the most complex and urgent challenges facing humanity in the twenty-first century. Rising global temperatures, caused primarily by the accumulation of greenhouse gases in the atmosphere, are triggering a cascade of environmental consequences that threaten ecosystems, human settlements, and food security worldwide. Extreme weather events, including powerful hurricanes, prolonged droughts, and unprecedented flooding, are becoming more frequent and severe. Coastal communities face the looming threat of rising sea levels, while agricultural regions grapple with shifting precipitation patterns that undermine crop yields. Addressing climate change demands immediate, coordinated global action, including a rapid transition to renewable energy sources, sustainable land management practices, and international agreements that hold nations accountable for their carbon emissions.`
  },
  {
    id: 'p3',
    title: 'The Banking Sector Evolution',
    category: 'banking',
    difficulty: 'hard',
    wordCount: 130,
    content: `The banking sector has undergone a remarkable transformation over the past two decades, driven by technological innovation, regulatory reforms, and changing consumer expectations. Traditional brick-and-mortar banks, once the cornerstone of financial services, now compete with agile fintech startups that leverage mobile applications and artificial intelligence to deliver faster, cheaper, and more personalized financial products. Digital payment systems have reduced dependence on cash, while blockchain technology and cryptocurrencies are challenging fundamental assumptions about money, trust, and financial intermediation. Regulatory bodies worldwide are grappling with the task of updating frameworks designed for a pre-digital era to accommodate these rapid changes while maintaining financial stability, protecting consumers, and preventing systemic risks that could destabilize economies. The future of banking will likely blend human expertise with algorithmic precision, creating hybrid models that balance innovation with prudence.`
  },
  {
    id: 'p4',
    title: 'Space Exploration and Human Ambition',
    category: 'science',
    difficulty: 'medium',
    wordCount: 110,
    content: `Space exploration represents humanity's boldest expression of curiosity and ambition. Since the first satellite was launched into orbit in 1957, humans have ventured beyond Earth's atmosphere, walked on the Moon, and sent robotic emissaries to distant planets and beyond the edges of our solar system. Today, a new era of space exploration is underway, driven by both government agencies and private companies that are lowering the cost of access to space through reusable rocket technology and innovative engineering. Mars has emerged as the next major destination, with missions planned to study its atmosphere, geology, and potential for past or present life. The dream of establishing a permanent human presence beyond Earth, once purely the domain of science fiction, is now within the realm of serious scientific and engineering endeavor.`
  },
  {
    id: 'p5',
    title: 'Artificial Intelligence in Healthcare',
    category: 'tech',
    difficulty: 'hard',
    wordCount: 125,
    content: `Artificial intelligence is poised to revolutionize healthcare by enhancing diagnostic accuracy, accelerating drug discovery, and personalizing treatment plans to individual patients. Machine learning algorithms trained on vast datasets of medical images can detect subtle patterns indicative of cancer, diabetic retinopathy, and other conditions with accuracy that rivals or exceeds that of experienced clinicians. Natural language processing tools can analyze electronic health records to identify patients at risk of adverse outcomes, enabling proactive interventions that prevent hospitalizations and improve quality of life. In pharmaceutical research, AI platforms are dramatically compressing the timeline for identifying promising drug candidates and predicting their efficacy and safety profiles. However, the integration of AI into clinical practice raises important questions about liability, algorithmic bias, data privacy, and the preservation of the human relationship at the heart of medical care.`
  },
  {
    id: 'p6',
    title: 'The Importance of Financial Literacy',
    category: 'banking',
    difficulty: 'easy',
    wordCount: 100,
    content: `Financial literacy is the foundation of personal economic wellbeing and long-term security. Understanding basic concepts such as budgeting, saving, investing, and debt management empowers individuals to make informed decisions that build wealth over time and protect against financial hardship. Many people struggle with credit card debt, inadequate retirement savings, and vulnerability to financial fraud simply because they lack fundamental knowledge about how money works. Schools and employers have a critical role to play in equipping people with these essential skills. Governments too can support financial literacy through public awareness campaigns, consumer protection regulations, and policies that encourage saving and responsible borrowing. A financially literate population is better equipped to participate meaningfully in the economy.`
  },
  {
    id: 'p7',
    title: 'Sustainable Agriculture',
    category: 'general',
    difficulty: 'medium',
    wordCount: 108,
    content: `Sustainable agriculture seeks to meet the food needs of the present without compromising the ability of future generations to meet their own needs. Conventional farming practices, while enormously productive, have exacted a heavy toll on natural resources, contributing to soil degradation, water depletion, loss of biodiversity, and greenhouse gas emissions. Sustainable farming approaches, including organic farming, agroforestry, integrated pest management, and precision agriculture, aim to produce food more efficiently and with fewer environmental impacts. Crop rotation, cover cropping, and reduced tillage practices help maintain soil health and reduce erosion. As the global population continues to grow and the effects of climate change intensify, the transition to more sustainable agricultural systems is increasingly recognized as both an ecological imperative and an economic opportunity.`
  },
  {
    id: 'p8',
    title: 'The Power of Education',
    category: 'general',
    difficulty: 'easy',
    wordCount: 95,
    content: `Education is universally recognized as one of the most powerful tools for improving individual lives and advancing societies. Access to quality education expands opportunities, reduces poverty, promotes gender equality, and strengthens democratic institutions. In the modern economy, where knowledge and skills are the primary drivers of productivity and innovation, the importance of education has never been greater. Yet significant disparities in educational quality and access persist both within and between countries, driven by inequalities of income, geography, gender, and ethnicity. Closing these gaps requires sustained investment in schools, teachers, and learning materials, as well as policies that address the social and economic barriers that prevent many children from reaching their full potential.`
  }
];
