require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const connectDB = require("./config/db");
const User = require("./models/Users");
const DailyAssignment = require("./models/DailyAssignment");

const QUESTION_BANK = {
  arrays: {
    leetcode: [
      {
        title: "Two Sum",
        difficulty: "easy",
        url: "https://leetcode.com/problems/two-sum/",
        hint: "Use a hash map to store value -> index while scanning once.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+two+sum+solution",
      },
      {
        title: "Container With Most Water",
        difficulty: "medium",
        url: "https://leetcode.com/problems/container-with-most-water/",
        hint: "Two pointers from both ends; move the smaller height.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+container+with+most+water+solution",
      },
      {
        title: "First Missing Positive",
        difficulty: "hard",
        url: "https://leetcode.com/problems/first-missing-positive/",
        hint: "Place each value x at index x-1 in-place when possible.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+first+missing+positive+solution",
      },
    ],
    gfg: [
      {
        title: "Reverse an Array",
        difficulty: "easy",
        url: "https://www.geeksforgeeks.org/problems/reverse-an-array/1",
        hint: "Use two pointers from both ends and swap.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+reverse+an+array+solution",
      },
      {
        title: "Kadane's Algorithm",
        difficulty: "medium",
        url: "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1",
        hint: "Keep best sum ending at current index.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+kadane+algorithm+solution",
      },
      {
        title: "Merge Without Extra Space",
        difficulty: "hard",
        url: "https://www.geeksforgeeks.org/problems/merge-two-sorted-arrays-1587115620/1",
        hint: "Use gap method to compare distant elements.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+merge+without+extra+space+solution",
      },
    ],
    codechef: [
      {
        title: "FLOW001",
        difficulty: "easy",
        url: "https://www.codechef.com/problems/FLOW001",
        hint: "Read two numbers and print their sum.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+FLOW001+solution",
      },
      {
        title: "MAXDIFF",
        difficulty: "medium",
        url: "https://www.codechef.com/problems/MAXDIFF",
        hint: "Sort and compare both partition strategies.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+MAXDIFF+solution",
      },
      {
        title: "CHFNSWPS",
        difficulty: "hard",
        url: "https://www.codechef.com/problems/CHFNSWPS",
        hint: "Count mismatches and minimize swap cost using global minimum.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+CHFNSWPS+solution",
      },
    ],
  },
  strings: {
    leetcode: [
      {
        title: "Valid Anagram",
        difficulty: "easy",
        url: "https://leetcode.com/problems/valid-anagram/",
        hint: "Compare frequency counts.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+valid+anagram+solution",
      },
      {
        title: "Longest Substring Without Repeating Characters",
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        hint: "Use sliding window with last seen index map.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+longest+substring+without+repeating+characters+solution",
      },
      {
        title: "Minimum Window Substring",
        difficulty: "hard",
        url: "https://leetcode.com/problems/minimum-window-substring/",
        hint: "Track required frequencies and shrink while valid.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+minimum+window+substring+solution",
      },
    ],
    gfg: [
      {
        title: "Anagram",
        difficulty: "easy",
        url: "https://www.geeksforgeeks.org/problems/anagram-1587115620/1",
        hint: "Use count array/map and compare.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+anagram+problem+solution",
      },
      {
        title: "Longest Common Prefix in an Array",
        difficulty: "medium",
        url: "https://www.geeksforgeeks.org/problems/longest-common-prefix-in-an-array5129/1",
        hint: "Shrink candidate prefix while iterating strings.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+longest+common+prefix+solution",
      },
      {
        title: "Smallest Window in a String Containing All Characters",
        difficulty: "hard",
        url: "https://www.geeksforgeeks.org/problems/smallest-distant-window3132/1",
        hint: "Sliding window with needed distinct character count.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+smallest+window+containing+all+characters+solution",
      },
    ],
    codechef: [
      {
        title: "FLOW007",
        difficulty: "easy",
        url: "https://www.codechef.com/problems/FLOW007",
        hint: "Reverse digits using modulo/division.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+FLOW007+solution",
      },
      {
        title: "PALIN",
        difficulty: "medium",
        url: "https://www.codechef.com/problems/PALIN",
        hint: "Construct next palindrome by mirroring and handling carries.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+PALIN+solution",
      },
      {
        title: "TWOSTRS",
        difficulty: "hard",
        url: "https://www.codechef.com/problems/TWOSTRS",
        hint: "Combine string matching with scoring constraints.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+TWOSTRS+solution",
      },
    ],
  },
  dp: {
    leetcode: [
      {
        title: "Climbing Stairs",
        difficulty: "easy",
        url: "https://leetcode.com/problems/climbing-stairs/",
        hint: "Classic Fibonacci transition.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+climbing+stairs+solution",
      },
      {
        title: "House Robber",
        difficulty: "medium",
        url: "https://leetcode.com/problems/house-robber/",
        hint: "Take max of rob/current-skip transitions.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+house+robber+solution",
      },
      {
        title: "Burst Balloons",
        difficulty: "hard",
        url: "https://leetcode.com/problems/burst-balloons/",
        hint: "Interval DP: choose last balloon to burst in range.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+burst+balloons+solution",
      },
    ],
    gfg: [
      {
        title: "0/1 Knapsack",
        difficulty: "easy",
        url: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1",
        hint: "Include/exclude transition over capacity.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+0+1+knapsack+solution",
      },
      {
        title: "Longest Common Subsequence",
        difficulty: "medium",
        url: "https://www.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1",
        hint: "2D DP over prefixes.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+lcs+solution",
      },
      {
        title: "Matrix Chain Multiplication",
        difficulty: "hard",
        url: "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1",
        hint: "Interval partition DP minimizing multiplication cost.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+matrix+chain+multiplication+solution",
      },
    ],
    codechef: [
      {
        title: "ALTARAY",
        difficulty: "easy",
        url: "https://www.codechef.com/problems/ALTARAY",
        hint: "Build alternating run lengths from right.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+ALTARAY+solution",
      },
      {
        title: "TADELIVE",
        difficulty: "medium",
        url: "https://www.codechef.com/problems/TADELIVE",
        hint: "Sort by delta and assign with constraints.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+TADELIVE+solution",
      },
      {
        title: "MCO16405",
        difficulty: "hard",
        url: "https://www.codechef.com/problems/MCO16405",
        hint: "Use optimized DP states and transitions carefully.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+MCO16405+solution",
      },
    ],
  },
  graphs: {
    leetcode: [
      {
        title: "Find Center of Star Graph",
        difficulty: "easy",
        url: "https://leetcode.com/problems/find-center-of-star-graph/",
        hint: "Center appears in first two edges.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+find+center+of+star+graph+solution",
      },
      {
        title: "Number of Islands",
        difficulty: "medium",
        url: "https://leetcode.com/problems/number-of-islands/",
        hint: "BFS/DFS flood fill each unvisited land cell.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+number+of+islands+solution",
      },
      {
        title: "Word Ladder II",
        difficulty: "hard",
        url: "https://leetcode.com/problems/word-ladder-ii/",
        hint: "Layered BFS + backtracking on parent graph.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+word+ladder+ii+solution",
      },
    ],
    gfg: [
      {
        title: "BFS of Graph",
        difficulty: "easy",
        url: "https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1",
        hint: "Queue + visited array.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+bfs+of+graph+solution",
      },
      {
        title: "Dijkstra Algorithm",
        difficulty: "medium",
        url: "https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1",
        hint: "Priority queue with distance relaxation.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+dijkstra+algorithm+solution",
      },
      {
        title: "Floyd Warshall",
        difficulty: "hard",
        url: "https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1",
        hint: "Try each node as intermediate in triple loop.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+floyd+warshall+solution",
      },
    ],
    codechef: [
      {
        title: "REVERSE",
        difficulty: "easy",
        url: "https://www.codechef.com/problems/REVERSE",
        hint: "Model with 0-1 BFS on weighted directed edges.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+REVERSE+solution",
      },
      {
        title: "DIGJUMP",
        difficulty: "medium",
        url: "https://www.codechef.com/problems/DIGJUMP",
        hint: "BFS with digit buckets for teleport edges.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+DIGJUMP+solution",
      },
      {
        title: "GERALD07",
        difficulty: "hard",
        url: "https://www.codechef.com/problems/GERALD07",
        hint: "Advanced graph offline queries/data structures.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+GERALD07+solution",
      },
    ],
  },
  trees: {
    leetcode: [
      {
        title: "Invert Binary Tree",
        difficulty: "easy",
        url: "https://leetcode.com/problems/invert-binary-tree/",
        hint: "Swap left/right recursively.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+invert+binary+tree+solution",
      },
      {
        title: "Binary Tree Level Order Traversal",
        difficulty: "medium",
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        hint: "BFS by levels using queue size.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+level+order+traversal+solution",
      },
      {
        title: "Binary Tree Maximum Path Sum",
        difficulty: "hard",
        url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        hint: "Postorder return best downward path and update global max.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+binary+tree+maximum+path+sum+solution",
      },
    ],
    gfg: [
      {
        title: "Preorder Traversal",
        difficulty: "easy",
        url: "https://www.geeksforgeeks.org/problems/preorder-traversal/1",
        hint: "Visit root-left-right.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+preorder+traversal+solution",
      },
      {
        title: "Diameter of a Binary Tree",
        difficulty: "medium",
        url: "https://www.geeksforgeeks.org/problems/diameter-of-binary-tree/1",
        hint: "Track height and update longest path.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+diameter+of+binary+tree+solution",
      },
      {
        title: "Serialize and Deserialize a Binary Tree",
        difficulty: "hard",
        url: "https://www.geeksforgeeks.org/problems/serialize-and-deserialize-a-binary-tree/1",
        hint: "Use BFS/DFS with null markers to preserve structure.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+serialize+deserialize+binary+tree+solution",
      },
    ],
    codechef: [
      {
        title: "TREE2",
        difficulty: "easy",
        url: "https://www.codechef.com/problems/TREE2",
        hint: "Count distinct positive heights.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+TREE2+solution",
      },
      {
        title: "SUBTREES",
        difficulty: "medium",
        url: "https://www.codechef.com/problems/SUBTREES",
        hint: "Tree DP over subtree contributions.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+SUBTREES+solution",
      },
      {
        title: "TREEREMOVAL",
        difficulty: "hard",
        url: "https://www.codechef.com/problems/TREEREMOVAL",
        hint: "Use structural properties and greedy/DFS ordering.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+TREEREMOVAL+solution",
      },
    ],
  },
  "binary-search": {
    leetcode: [
      {
        title: "Binary Search",
        difficulty: "easy",
        url: "https://leetcode.com/problems/binary-search/",
        hint: "Classic low/high loop with mid.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+binary+search+solution",
      },
      {
        title: "Search in Rotated Sorted Array",
        difficulty: "medium",
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        hint: "One half is always sorted; decide side by bounds.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+search+in+rotated+sorted+array+solution",
      },
      {
        title: "Median of Two Sorted Arrays",
        difficulty: "hard",
        url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        hint: "Binary search partition on smaller array.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+median+of+two+sorted+arrays+solution",
      },
    ],
    gfg: [
      {
        title: "Binary Search",
        difficulty: "easy",
        url: "https://www.geeksforgeeks.org/problems/binary-search-1587115620/1",
        hint: "Shrink interval by comparing with mid.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+binary+search+solution",
      },
      {
        title: "Search in Rotated Array",
        difficulty: "medium",
        url: "https://www.geeksforgeeks.org/problems/search-in-a-rotated-array4618/1",
        hint: "Detect sorted half each iteration.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+search+in+rotated+array+solution",
      },
      {
        title: "Allocate Minimum Pages",
        difficulty: "hard",
        url: "https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1",
        hint: "Binary search answer on max pages per student.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+allocate+minimum+pages+solution",
      },
    ],
    codechef: [
      {
        title: "BINSEARCH",
        difficulty: "easy",
        url: "https://www.codechef.com/problems/BINSEARCH",
        hint: "Use sorted condition and boundary checks.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+BINSEARCH+solution",
      },
      {
        title: "KTHMAX",
        difficulty: "medium",
        url: "https://www.codechef.com/problems/KTHMAX",
        hint: "Combine sorting and prefix counts with binary search.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+KTHMAX+solution",
      },
      {
        title: "SEAD",
        difficulty: "hard",
        url: "https://www.codechef.com/problems/SEAD",
        hint: "Optimize queries with binary search on preprocessed data.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+SEAD+solution",
      },
    ],
  },
  "sliding-window": {
    leetcode: [
      {
        title: "Maximum Average Subarray I",
        difficulty: "easy",
        url: "https://leetcode.com/problems/maximum-average-subarray-i/",
        hint: "Maintain rolling sum of fixed window size k.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+maximum+average+subarray+i+solution",
      },
      {
        title: "Longest Repeating Character Replacement",
        difficulty: "medium",
        url: "https://leetcode.com/problems/longest-repeating-character-replacement/",
        hint: "Window valid if non-max chars <= k.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+character+replacement+solution",
      },
      {
        title: "Minimum Window Substring",
        difficulty: "hard",
        url: "https://leetcode.com/problems/minimum-window-substring/",
        hint: "Expand to satisfy, shrink to minimize.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=leetcode+minimum+window+substring+solution",
      },
    ],
    gfg: [
      {
        title: "First negative integer in every window of size k",
        difficulty: "easy",
        url: "https://www.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1",
        hint: "Queue indices of negative elements within window.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+first+negative+integer+in+every+window+solution",
      },
      {
        title: "Count Occurrences of Anagrams",
        difficulty: "medium",
        url: "https://www.geeksforgeeks.org/problems/count-occurences-of-anagrams5839/1",
        hint: "Compare frequency maps for each window.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+count+occurrences+of+anagrams+solution",
      },
      {
        title: "Smallest Window in a String Containing All Characters",
        difficulty: "hard",
        url: "https://www.geeksforgeeks.org/problems/smallest-distant-window3132/1",
        hint: "Track required chars and shrink while feasible.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=gfg+smallest+window+in+a+string+containing+all+characters+solution",
      },
    ],
    codechef: [
      {
        title: "FRGTNLNG",
        difficulty: "easy",
        url: "https://www.codechef.com/problems/FRGTNLNG",
        hint: "Use set membership checks over phrases.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+FRGTNLNG+solution",
      },
      {
        title: "SUBPRNJL",
        difficulty: "medium",
        url: "https://www.codechef.com/problems/SUBPRNJL",
        hint: "Use window frequency/order statistics efficiently.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+SUBPRNJL+solution",
      },
      {
        title: "CHEFSUBA",
        difficulty: "hard",
        url: "https://www.codechef.com/problems/CHEFSUBA",
        hint: "Circular windows + range maxima optimization.",
        solutionUrl:
          "https://www.youtube.com/results?search_query=codechef+CHEFSUBA+solution",
      },
    ],
  },
};

const SUPPORTED_TOPICS = Object.keys(QUESTION_BANK);
const SUPPORTED_DIFFICULTIES = ["easy", "medium", "hard", "auto"];
const RECENT_ASSIGNMENT_WINDOW = 7;
const DEFAULT_TIMEZONE = "UTC";

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];
const normalizeTopic = (topic) => topic.trim().toLowerCase();
const normalizeQuestion = (question) => ({ difficulty: "easy", ...question });
const isValidTime = (value) => /^([01]?\d|2[0-3]):[0-5]\d$/.test(value);
const isValidTimezone = (timezone) => {
  try {
    Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(new Date());
    return true;
  } catch (error) {
    return false;
  }
};
const getZonedDateTime = (timezone, date = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const getPart = (type) => parts.find((part) => part.type === type)?.value;

  return {
    dateKey: `${getPart("year")}-${getPart("month")}-${getPart("day")}`,
    timeKey: `${getPart("hour")}:${getPart("minute")}`,
  };
};
const getUserTimezone = (user) => {
  const timezone = user?.timezone || DEFAULT_TIMEZONE;
  return isValidTimezone(timezone) ? timezone : DEFAULT_TIMEZONE;
};
const getUserDateKey = (user, dayOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return getZonedDateTime(getUserTimezone(user), date).dateKey;
};
const getUserTimeKey = (user) => {
  return getZonedDateTime(getUserTimezone(user)).timeKey;
};
const getAutoDifficulty = (streak = 0) => {
  if (streak >= 10) return "hard";
  if (streak >= 5) return "medium";
  return "easy";
};
const getEffectiveDifficulty = (user) => {
  if (!user?.difficulty || user.difficulty === "auto") {
    return getAutoDifficulty(user?.streak || 0);
  }
  return user.difficulty;
};

const startBot = async () => {
  await connectDB();

  const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true,
  });

  try {
    await bot.setMyCommands([
      { command: "start", description: "Show bot help" },
      { command: "settopic", description: "Set topics (space-separated)" },
      { command: "setdifficulty", description: "Set easy/medium/hard/auto" },
      { command: "settimezone", description: "Set timezone (e.g. Asia/Kolkata)" },
      { command: "settime", description: "Set morning/evening reminder time" },
      { command: "status", description: "Show current settings and today status" },
      { command: "timecheck", description: "Debug local time and trigger match" },
      { command: "send", description: "Send today questions now" },
      { command: "sendhints", description: "Send today hints now" },
      { command: "sendsolutions", description: "Send yesterday solutions now" },
    ]);
  } catch (err) {
    console.error("Failed to set Telegram command menu:", err?.message || err);
  }

  bot.on("polling_error", (err) => {
    const message = err?.message || "";
    if (message.includes("409 Conflict")) {
      console.error(
        "❌ Telegram polling conflict detected. Stop other bot instances (or webhook) and restart this process.",
      );
      process.exit(1);
    }
  });

  const getAvailableTopics = (user) => {
    return (user?.topics || [])
      .map(normalizeTopic)
      .filter((topic) => QUESTION_BANK[topic]);
  };

  const formatQuestionMessage = (assignment) => {
    return `📌 Daily DSA Questions (${assignment.topic})\n\n1) LeetCode: ${assignment.questions.leetcode.title}\n${assignment.questions.leetcode.url}\n\n2) GFG: ${assignment.questions.gfg.title}\n${assignment.questions.gfg.url}\n\n3) CodeChef: ${assignment.questions.codechef.title}\n${assignment.questions.codechef.url}`;
  };

  const formatHintMessage = (assignment) => {
    return `💡 Evening Hints (${assignment.topic})\n\n1) LeetCode: ${assignment.questions.leetcode.title}\nHint: ${assignment.questions.leetcode.hint}\n\n2) GFG: ${assignment.questions.gfg.title}\nHint: ${assignment.questions.gfg.hint}\n\n3) CodeChef: ${assignment.questions.codechef.title}\nHint: ${assignment.questions.codechef.hint}`;
  };

  const formatSolutionMessage = (assignment) => {
    return `✅ Yesterday's Solutions (${assignment.topic})\n\n1) LeetCode: ${assignment.questions.leetcode.title}\n${assignment.questions.leetcode.solutionUrl}\n\n2) GFG: ${assignment.questions.gfg.title}\n${assignment.questions.gfg.solutionUrl}\n\n3) CodeChef: ${assignment.questions.codechef.title}\n${assignment.questions.codechef.solutionUrl}`;
  };

  const buildRecentUsedUrlSets = (recentAssignments) => {
    const used = {
      leetcode: new Set(),
      gfg: new Set(),
      codechef: new Set(),
    };

    for (const item of recentAssignments) {
      if (item.questions?.leetcode?.url)
        used.leetcode.add(item.questions.leetcode.url);
      if (item.questions?.gfg?.url) used.gfg.add(item.questions.gfg.url);
      if (item.questions?.codechef?.url)
        used.codechef.add(item.questions.codechef.url);
    }

    return used;
  };

  const pickQuestionForPlatform = (
    platformPool,
    usedUrlSet,
    preferredDifficulty,
  ) => {
    const normalizedPool = platformPool.map(normalizeQuestion);
    const byDifficulty = normalizedPool.filter(
      (q) => q.difficulty === preferredDifficulty,
    );
    const effectivePool = byDifficulty.length ? byDifficulty : normalizedPool;
    const unseenPool = effectivePool.filter((q) => !usedUrlSet.has(q.url));
    const finalPool = unseenPool.length ? unseenPool : effectivePool;
    return pickRandom(finalPool);
  };

  const getOrCreateTodayAssignment = async (user, availableTopics, dateKey) => {
    const chatId = user.chatId;
    let assignment = await DailyAssignment.findOne({ chatId, dateKey });

    if (!assignment) {
      const preferredDifficulty = getEffectiveDifficulty(user);
      const recentAssignments = await DailyAssignment.find({ chatId })
        .sort({ createdAt: -1 })
        .limit(RECENT_ASSIGNMENT_WINDOW);
      const usedUrlSets = buildRecentUsedUrlSets(recentAssignments);
      const selectedTopic = pickRandom(availableTopics);
      const topicBank = QUESTION_BANK[selectedTopic];
      const leetcodeQuestion = pickQuestionForPlatform(
        topicBank.leetcode,
        usedUrlSets.leetcode,
        preferredDifficulty,
      );
      const gfgQuestion = pickQuestionForPlatform(
        topicBank.gfg,
        usedUrlSets.gfg,
        preferredDifficulty,
      );
      const codechefQuestion = pickQuestionForPlatform(
        topicBank.codechef,
        usedUrlSets.codechef,
        preferredDifficulty,
      );

      assignment = await DailyAssignment.create({
        chatId,
        dateKey,
        topic: selectedTopic,
        difficulty: preferredDifficulty,
        questions: {
          leetcode: leetcodeQuestion,
          gfg: gfgQuestion,
          codechef: codechefQuestion,
        },
      });
    }

    return assignment;
  };

  const runSchedulerTick = async () => {
    const users = await User.find({});
    for (const user of users) {
      try {
        const userTimeKey = getUserTimeKey(user);
        const userDateKey = getUserDateKey(user, 0);
        const yesterdayDateKey = getUserDateKey(user, -1);

        if (user.morningTime && user.morningTime === userTimeKey) {
          const availableTopics = getAvailableTopics(user);
          if (availableTopics.length) {
            const yesterdayAssignment = await DailyAssignment.findOne({
              chatId: user.chatId,
              dateKey: yesterdayDateKey,
            });

            if (yesterdayAssignment && !yesterdayAssignment.solutionsSentAt) {
              await bot.sendMessage(
                user.chatId,
                formatSolutionMessage(yesterdayAssignment),
              );
              yesterdayAssignment.solutionsSentAt = new Date();
              await yesterdayAssignment.save();
            }

            const assignment = await getOrCreateTodayAssignment(
              user,
              availableTopics,
              userDateKey,
            );

            if (!assignment.questionsSentAt) {
              await bot.sendMessage(
                user.chatId,
                formatQuestionMessage(assignment),
              );
              assignment.questionsSentAt = new Date();
              await assignment.save();
              user.streak = (user.streak || 0) + 1;
              await user.save();
            }
          }
        }

        if (user.eveningTime && user.eveningTime === userTimeKey) {
          const assignment = await DailyAssignment.findOne({
            chatId: user.chatId,
            dateKey: userDateKey,
          });

          if (assignment && !assignment.hintsSentAt) {
            await bot.sendMessage(user.chatId, formatHintMessage(assignment));
            assignment.hintsSentAt = new Date();
            await assignment.save();
          }
        }
      } catch (err) {
        console.error(`Scheduler user error for ${user.chatId}:`, err);
      }
    }
  };

  setInterval(() => {
    runSchedulerTick().catch((err) => {
      console.error("Scheduler tick failed:", err);
    });
  }, 60 * 1000);

  runSchedulerTick().catch((err) => {
    console.error("Initial scheduler tick failed:", err);
  });

  // Start command
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      `👋 Welcome to CodePulse Bot!

I will help you stay consistent with DSA 🚀

Use:
/settopic arrays strings dp graphs trees binary-search sliding-window
/setdifficulty auto
/settimezone Asia/Kolkata
/settime morning 08:00
/settime evening 20:00
/status
/timecheck
/send
/sendhints
/sendsolutions`,
    );
  });

  // Test command
  bot.onText(/\/hello/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hello Dhruv 😎");
  });

  // Set topic command
  bot.onText(/\/settopic(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const input = match?.[1]?.trim();

    if (!input) {
      bot.sendMessage(
        chatId,
        "⚠️ Please provide topics. Example: /settopic arrays dp graphs trees",
      );
      return;
    }

    const topics = input.split(/\s+/).map(normalizeTopic).filter(Boolean);
    const validTopics = topics.filter((topic) =>
      SUPPORTED_TOPICS.includes(topic),
    );

    if (!validTopics.length) {
      bot.sendMessage(
        chatId,
        `⚠️ No supported topics found. Supported: ${SUPPORTED_TOPICS.join(", ")}`,
      );
      return;
    }

    try {
      let user = await User.findOne({ chatId });

      if (!user) {
        user = new User({ chatId, topics: validTopics });
      } else {
        user.topics = validTopics;
      }

      await user.save();

      bot.sendMessage(chatId, `✅ Topics saved: ${validTopics.join(", ")}`);
    } catch (err) {
      console.error("Error saving topics:", err);
      bot.sendMessage(chatId, "❌ Error saving topics");
    }
  });

  // Set reminder time command
  bot.onText(
    /\/settime(?:\s+(morning|evening)\s+(\d{1,2}:\d{2}))?/i,
    async (msg, match) => {
      const chatId = msg.chat.id;
      const timeType = match?.[1]?.toLowerCase();
      const timeValue = match?.[2];

      if (!timeType || !timeValue) {
        bot.sendMessage(
          chatId,
          "⚠️ Usage: /settime morning 08:00 or /settime evening 20:00",
        );
        return;
      }

      if (!isValidTime(timeValue)) {
        bot.sendMessage(
          chatId,
          "⚠️ Invalid time. Use 24-hour HH:mm format, e.g. 08:00",
        );
        return;
      }

      try {
        let user = await User.findOne({ chatId });

        if (!user) {
          user = new User({ chatId });
        }

        if (timeType === "morning") {
          user.morningTime = timeValue;
        } else {
          user.eveningTime = timeValue;
        }

        await user.save();
        bot.sendMessage(chatId, `✅ ${timeType} time saved: ${timeValue}`);
      } catch (err) {
        console.error("Error saving time:", err);
        bot.sendMessage(chatId, "❌ Error saving time");
      }
    },
  );

  // Set timezone command
  bot.onText(
    /^\/settimezone(?:@\w+)?(?:\s+([A-Za-z_\/]+))?\s*$/i,
    async (msg, match) => {
      const chatId = msg.chat.id;
      const timezone = match?.[1];

      if (!timezone) {
        bot.sendMessage(
          chatId,
          "⚠️ Usage: /settimezone Asia/Kolkata (IANA timezone format)",
        );
        return;
      }

      if (!isValidTimezone(timezone)) {
        bot.sendMessage(
          chatId,
          "⚠️ Invalid timezone. Example: Asia/Kolkata, Europe/London, America/New_York",
        );
        return;
      }

      try {
        let user = await User.findOne({ chatId });
        if (!user) {
          user = new User({ chatId });
        }

        user.timezone = timezone;
        await user.save();
        bot.sendMessage(chatId, `✅ Timezone saved: ${timezone}`);
      } catch (err) {
        console.error("Error saving timezone:", err);
        bot.sendMessage(chatId, "❌ Error saving timezone");
      }
    },
  );

  // Set difficulty command
  bot.onText(
    /^\/setdifficulty(?:@\w+)?(?:\s+(easy|medium|hard|auto))?\s*$/i,
    async (msg, match) => {
      const chatId = msg.chat.id;
      const difficulty = match?.[1]?.toLowerCase();

      if (!difficulty) {
        bot.sendMessage(
          chatId,
          "⚠️ Usage: /setdifficulty easy | medium | hard | auto",
        );
        return;
      }

      if (!SUPPORTED_DIFFICULTIES.includes(difficulty)) {
        bot.sendMessage(
          chatId,
          `⚠️ Supported difficulty values: ${SUPPORTED_DIFFICULTIES.join(", ")}`,
        );
        return;
      }

      try {
        let user = await User.findOne({ chatId });
        if (!user) {
          user = new User({ chatId });
        }

        user.difficulty = difficulty;
        await user.save();
        bot.sendMessage(chatId, `✅ Difficulty saved: ${difficulty}`);
      } catch (err) {
        console.error("Error saving difficulty:", err);
        bot.sendMessage(chatId, "❌ Error saving difficulty");
      }
    },
  );

  // Send today's question block manually
  bot.onText(/^\/send(?:@\w+)?\s*$/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await User.findOne({ chatId });
      const availableTopics = getAvailableTopics(user);

      if (!availableTopics.length) {
        bot.sendMessage(
          chatId,
          `⚠️ Please set supported topics first with /settopic ${SUPPORTED_TOPICS.join(" ")}`,
        );
        return;
      }

      const assignment = await getOrCreateTodayAssignment(
        user,
        availableTopics,
        getUserDateKey(user, 0),
      );

      await bot.sendMessage(chatId, formatQuestionMessage(assignment));

      if (!assignment.questionsSentAt) {
        assignment.questionsSentAt = new Date();
        await assignment.save();
        user.streak = (user.streak || 0) + 1;
        await user.save();
      }
    } catch (err) {
      console.error("Error sending questions:", err);
      bot.sendMessage(chatId, "❌ Error sending daily questions");
    }
  });

  // Send today's hints manually
  bot.onText(/^\/sendhints(?:@\w+)?\s*$/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await User.findOne({ chatId });
      if (!user) {
        bot.sendMessage(chatId, "⚠️ No profile found yet. Use /start first.");
        return;
      }

      const assignment = await DailyAssignment.findOne({
        chatId,
        dateKey: getUserDateKey(user, 0),
      });

      if (!assignment) {
        bot.sendMessage(
          chatId,
          "⚠️ No assignment found for today. Use /send first.",
        );
        return;
      }

      await bot.sendMessage(chatId, formatHintMessage(assignment));

      if (!assignment.hintsSentAt) {
        assignment.hintsSentAt = new Date();
        await assignment.save();
      }
    } catch (err) {
      console.error("Error sending hints:", err);
      bot.sendMessage(chatId, "❌ Error sending hints");
    }
  });

  // Send yesterday's solutions manually
  bot.onText(/^\/sendsolutions(?:@\w+)?\s*$/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await User.findOne({ chatId });
      if (!user) {
        bot.sendMessage(chatId, "⚠️ No profile found yet. Use /start first.");
        return;
      }

      const assignment = await DailyAssignment.findOne({
        chatId,
        dateKey: getUserDateKey(user, -1),
      });

      if (!assignment) {
        bot.sendMessage(
          chatId,
          "⚠️ No assignment found for yesterday yet. Solutions are shared the next day.",
        );
        return;
      }

      await bot.sendMessage(chatId, formatSolutionMessage(assignment));

      if (!assignment.solutionsSentAt) {
        assignment.solutionsSentAt = new Date();
        await assignment.save();
      }
    } catch (err) {
      console.error("Error sending solutions:", err);
      bot.sendMessage(chatId, "❌ Error sending solutions");
    }
  });

  // Show current settings
  bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await User.findOne({ chatId });
      if (!user) {
        bot.sendMessage(
          chatId,
          "⚠️ No profile found yet. Start with /settopic and /settime commands.",
        );
        return;
      }

      const assignment = await DailyAssignment.findOne({
        chatId,
        dateKey: getUserDateKey(user, 0),
      });

      const topicsText = user.topics?.length
        ? user.topics.join(", ")
        : "Not set";
      const configuredDifficulty = user.difficulty || "auto";
      const activeDifficulty = getEffectiveDifficulty(user);
      const timezoneText = getUserTimezone(user);
      const morningText = user.morningTime || "Not set";
      const eveningText = user.eveningTime || "Not set";
      const todayText = assignment
        ? `Generated (${assignment.topic}, ${assignment.difficulty || activeDifficulty}) | Morning sent: ${assignment.questionsSentAt ? "Yes" : "No"} | Hints sent: ${assignment.hintsSentAt ? "Yes" : "No"} | Solutions sent: ${assignment.solutionsSentAt ? "Yes" : "No"}`
        : "Not generated yet";

      bot.sendMessage(
        chatId,
        `📊 Your Status\n\nTopics: ${topicsText}\nDifficulty: ${configuredDifficulty} (active: ${activeDifficulty})\nStreak: ${user.streak || 0}\nTimezone: ${timezoneText}\nMorning Time: ${morningText}\nEvening Time: ${eveningText}\nToday's Questions: ${todayText}`,
      );
    } catch (err) {
      console.error("Error fetching status:", err);
      bot.sendMessage(chatId, "❌ Error fetching status");
    }
  });

  // Debug timezone/schedule calculations for current user
  bot.onText(/^\/timecheck(?:@\w+)?\s*$/i, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await User.findOne({ chatId });
      if (!user) {
        bot.sendMessage(
          chatId,
          "⚠️ No profile found yet. Set /settimezone and /settime first.",
        );
        return;
      }

      const timezone = getUserTimezone(user);
      const zonedNow = getZonedDateTime(timezone);
      const morningTime = user.morningTime || "Not set";
      const eveningTime = user.eveningTime || "Not set";
      const morningDue = user.morningTime
        ? user.morningTime === zonedNow.timeKey
        : false;
      const eveningDue = user.eveningTime
        ? user.eveningTime === zonedNow.timeKey
        : false;

      bot.sendMessage(
        chatId,
        `🕒 Time Check\n\nTimezone: ${timezone}\nLocal Date: ${zonedNow.dateKey}\nLocal Time: ${zonedNow.timeKey}\nMorning Time: ${morningTime}\nEvening Time: ${eveningTime}\nMorning Trigger Now: ${morningDue ? "Yes" : "No"}\nEvening Trigger Now: ${eveningDue ? "Yes" : "No"}`,
      );
    } catch (err) {
      console.error("Error in timecheck:", err);
      bot.sendMessage(chatId, "❌ Error checking timezone/schedule");
    }
  });

  // Handle all messages
  bot.on("message", (msg) => {
    console.log(msg.text);
  });
};

startBot().catch((err) => {
  console.error("Failed to start bot:", err);
  process.exit(1);
});
