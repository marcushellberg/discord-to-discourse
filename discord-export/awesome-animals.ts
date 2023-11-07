const adjectives = [
    'Amazing', 'Awesome', 'Astonishing', 'Astounding', 'Animated', 'Admirable', 'Appealing', 'Agreeable', 'Adorable', 'Artistic', 'Attractive', 'Affectionate', 'Amusing', 'Ambitious', 'Avid', 'Amicable', 'Affable', 'Altruistic', 'Adaptable', 'Analytical',
    'Blissful', 'Brilliant', 'Beautiful', 'Bountiful', 'Bubbly', 'Brave', 'Balanced', 'Benevolent', 'Blessed', 'Bright', 'Bountiful', 'Buoyant', 'Beaming', 'Big-hearted', 'Bubbly', 'Beneficial', 'Bonny', 'Bounteous', 'Benevolent', 'Bountiful',
    'Charming', 'Cheerful', 'Colorful', 'Creative', 'Clever', 'Caring', 'Calm', 'Courteous', 'Confident', 'Congenial', 'Capable', 'Compassionate', 'Considerate', 'Cooperative', 'Courageous', 'Charismatic', 'Convivial', 'Conscientious', 'Cultured', 'Communicative',
    'Delightful', 'Dapper', 'Dazzling', 'Distinctive', 'Divine', 'Diligent', 'Devoted', 'Dutiful', 'Dependable', 'Disciplined', 'Decisive', 'Determined', 'Diplomatic', 'Dextrous', 'Dynamic', 'Driven', 'Dedicated', 'Dignified', 'Discrete', 'Deep',
    'Energetic', 'Eager', 'Enthusiastic', 'Exciting', 'Excellent', 'Earnest', 'Ebullient', 'Effervescent', 'Eloquent', 'Empathetic', 'Endearing', 'Enduring', 'Engaging', 'Enterprising', 'Enthusiastic', 'Ethical', 'Euphoric', 'Ebullient', 'Egalitarian', 'Effervescent',
    'Fabulous', 'Fantastic', 'Fun', 'Festive', 'Friendly', 'Faithful', 'Fearless', 'Forthright', 'Frank', 'Funny', 'Flexible', 'Forgiving', 'Free-spirited', 'Full of life', 'Fun-loving', 'Fair', 'Focused', 'Friendly', 'Forthcoming', 'Free-spirited',
    'Great', 'Glorious', 'Graceful', 'Genuine', 'Giving', 'Gallant', 'Gracious', 'Gregarious', 'Generous', 'Gentle', 'Genuine', 'Good', 'Grounded', 'Grateful', 'Guileless', 'Guiding', 'Gutsy', 'Giving', 'Gregarious', 'Good',
    'Happy', 'Handsome', 'Healthy', 'Hearty', 'Helpful', 'Heroic', 'Honorable', 'Honest', 'Hopeful', 'Humorous', 'Humble', 'Humanitarian', 'Hardworking', 'Harmonious', 'Healing', 'Heroic', 'Holistic', 'Hospitable', 'Humanistic', 'Humane',
    'Incredible', 'Impressive', 'Inspiring', 'Important', 'Imaginative', 'Inventive', 'Insightful', 'Intuitive', 'Ingenious', 'Inquisitive', 'Idealistic', 'Integrity', 'Intelligent', 'Innovative', 'Illuminating', 'Inspirational', 'Industrious', 'Irrepressible', 'Interesting', 'Inclusive',
    'Jolly', 'Joyful', 'Jazzy', 'Jumpy', 'Just', 'Jovial', 'Jaunty', 'Judicious', 'Joyous', 'Jubilant', 'Jewel', 'Jackpot', 'Jester', 'Jazzy', 'Jocund', 'Joint', 'Jocular', 'Jubilant', 'Joie de vivre', 'Jocund',
    'Kind', 'Knowledgeable', 'Keen', 'Kooky', 'Kindhearted', 'Kindly', 'Keen', 'Karmic', 'Kismet', 'Kinetic', 'Kudos', 'Keeper', 'Key', 'Kosher', 'Kudos', 'Karma', 'Knowing', 'Kinetic', 'Kismet', 'Karmic',
    'Lovely', 'Lively', 'Lighthearted', 'Ludicrous', 'Legendary', 'Loyal', 'Loving', 'Logical', 'Liberated', 'Learned', 'Light', 'Limitless', 'Lionhearted', 'Lively', 'Luminous', 'Laughing', 'Loving', 'Laurel', 'Luminous', 'Liberated',
    'Magnificent', 'Marvelous', 'Mighty', 'Mystical', 'Motivated', 'Meritorious', 'Magnanimous', 'Masterful', 'Meaningful', 'Mirthful', 'Moral', 'Motivated', 'Multitalented', 'Musical', 'Munificent', 'Meritorious', 'Mindful', 'Magnanimous', 'Marvelous', 'Munificent',
    'Nice', 'Nifty', 'Nimble', 'Noteworthy', 'Nourishing', 'Noble', 'Noteworthy', 'Nurturing', 'Natural', 'Nimble', 'Notable', 'Novel', 'Nourishing', 'Nifty', 'Noble', 'Noteworthy', 'Nourishing', 'Nurturing', 'Nice', 'Natural',
    'Outstanding', 'Original', 'Optimistic', 'Observant', 'Objective', 'Open-minded', 'Organized', 'Observant', 'Optimistic', 'Orderly', 'Outgoing', 'Outspoken', 'Objective', 'Observant', 'Open-minded', 'Optimistic', 'Outstanding', 'Obliging', 'Organized', 'Observant',
    'Pleasant', 'Peaceful', 'Playful', 'Perfect', 'Productive', 'Patient', 'Perceptive', 'Poised', 'Punctual', 'Passionate', 'Positive', 'Persuasive', 'Philosophical', 'Pioneering', 'Practical', 'Praiseworthy', 'Precise', 'Proactive', 'Professional', 'Punctual',
    'Quick', 'Quirky', 'Qualified', 'Quaint', 'Quality', 'Quietly confident', 'Qualified', 'Quirky', 'Quintessential', 'Quick-witted', 'Qualified', 'Quiescent', 'Quality-focused', 'Quintessential', 'Quick', 'Quirky', 'Qualified', 'Quintessential', 'Quick-witted', 'Quixotic',
    'Remarkable', 'Radiant', 'Reliable', 'Resilient', 'Resourceful', 'Respectful', 'Responsible', 'Reliable', 'Resolute', 'Rational', 'Realistic', 'Reverent', 'Reflective', 'Relaxed', 'Reliable', 'Respectful', 'Resourceful', 'Reverent', 'Rational', 'Realistic',
    'Spectacular', 'Sparkling', 'Spunky', 'Spirited', 'Sensational', 'Selfless', 'Sensible', 'Sincere', 'Studious', 'Stalwart', 'Steady', 'Strong', 'Supportive', 'Sympathetic', 'Sanguine', 'Secure', 'Self-aware', 'Sagacious', 'Serene', 'Sanguine',
    'Terrific', 'Talented', 'Thoughtful', 'Thankful', 'Thriving', 'Tenacious', 'Thorough', 'Temperate', 'Tireless', 'Tolerant', 'Tactful', 'Trustworthy', 'Tranquil', 'Truthful', 'Teachable', 'Thoughtful', 'Tireless', 'Tenacious', 'Tranquil', 'Truthful',
    'Unique', 'Uplifting', 'Upbeat', 'Unreal', 'Unstoppable', 'Understanding', 'Unbiased', 'Unbound', 'Unfettered', 'Unflappable', 'Upright', 'Urbane', 'Useful', 'Utilitarian', 'Unbiased', 'Unconventional', 'Understanding', 'Upbeat', 'Unflappable', 'Uplifting',
    'Vivacious', 'Vibrant', 'Valiant', 'Victorious', 'Visionary', 'Virtuous', 'Vivacious', 'Valorous', 'Veracious', 'Versatile', 'Vibrant', 'Vigorous', 'Vital', 'Vested', 'Valiant', 'Veracious', 'Virtuous', 'Vivacious', 'Valorous', 'Vested',
    'Wonderful', 'Witty', 'Wise', 'Whimsical', 'Wholehearted', 'Warm', 'Willing', 'Winsome', 'Wondrous', 'Worthwhile', 'Welcoming', 'Well-balanced', 'Wise', 'Witty', 'Warmhearted', 'Willing', 'Winsome', 'Wise', 'Wondrous', 'Worthwhile',
    'Youthful', 'Yummy', 'Yippee', 'Yesteryear', 'Yearning', 'Young', 'Yummy', 'Yare', 'Yearning', 'Yielding', 'Yummy', 'Yogic', 'Youthful', 'Yippee', 'Yogic', 'Yearning', 'Yummy', 'Yare', 'Youthful', 'Yippee',
    'Zany', 'Zesty', 'Zippy', 'Zingy', 'Zazzy', 'Zealous', 'Zestful', 'Zingy', 'Zen', 'Zoned-in', 'Zesty', 'Zippy', 'Zany', 'Zen', 'Zingy', 'Zesty', 'Zingy', 'Zestful', 'Zippy', 'Zany'
];

const animals = [
    'Aardvark', 'Antelope', 'Alligator', 'Armadillo', 'Alpaca',
    'Baboon', 'Badger', 'Bear', 'Beaver', 'Boar',
    'Camel', 'Cat', 'Cougar', 'Coyote', 'Crane',
    'Deer', 'Dog', 'Donkey', 'Dingo', 'Duck',
    'Emu', 'Elephant', 'Elk', 'Echidna', 'Eagle',
    'Fox', 'Frog', 'Flamingo', 'Ferret', 'Falcon',
    'Gazelle', 'Giraffe', 'Goat', 'Grasshopper', 'Gnu',
    'Hippo', 'Horse', 'Hedgehog', 'Hyena', 'Hawk',
    'Iguana', 'Impala', 'Ibex', 'Inchworm', 'Ibis',
    'Jaguar', 'Jackal', 'Jellyfish', 'Joey', 'Jay',
    'Kangaroo', 'Koala', 'Kookaburra', 'Kiwi', 'Komodo',
    'Llama', 'Leopard', 'Lion', 'Lynx', 'Lemur',
    'Monkey', 'Moose', 'Meerkat', 'Mule', 'Manatee',
    'Newt', 'Nightingale', 'Numbat', 'Narwhal', 'Nautilus',
    'Ocelot', 'Otter', 'Owl', 'Okapi', 'Ostrich',
    'Panda', 'Panther', 'Pug', 'Porcupine', 'Peacock',
    'Quokka', 'Quail', 'Quoll', 'Quetzal', 'Quelea',
    'Rhino', 'Rabbit', 'Raccoon', 'Reindeer', 'Rat',
    'Snake', 'Seal', 'Sheep', 'Squirrel', 'Shark',
    'Tiger', 'Turtle', 'Toad', 'Tasmanian', 'Tortoise',
    'Urial', 'Uakari', 'Uguisu', 'Urchin', 'Umbrellabird',
    'Vulture', 'Vicuna', 'Vole', 'Viper', 'Vespa',
    'Wolf', 'Wombat', 'Walrus', 'Warthog', 'Whale',
    'Yak', 'Yorkshire', 'Yeti', 'Yabby', 'Yaffle',
    'Zebra', 'Zorse', 'Zonkey', 'Zebu', 'Zander'
];

export function generateRandomName() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];

    return `${adjective} ${animal}`;

}
