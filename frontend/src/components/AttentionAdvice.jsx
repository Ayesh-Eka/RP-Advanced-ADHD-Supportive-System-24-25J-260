import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/TrainAttentionHyperactivity.css"; // ✅ Import CSS for styling
import { FaArrowLeft } from "react-icons/fa";

const AttentionAdvice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[180vh] flex justify-center items-center h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-purple-300">
      <div className="bg-[#F5F1E9] p-5 rounded-lg shadow-2xl text-center w-[1400px] ">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-[#6a5acd]">Boost Attention of Your Kid</h2>
        </div>
  
        <div className="text-left text-[15px] text-[#5c4033] bg-[#F2E6D9] p-3 rounded-md mb-4 leading-relaxed text-base">
          <p>
            Below, we suggest tips and <strong className="text-gray-700">training activities</strong>. 
            Choose any and Guide your child to play.
            After completing the Activities, if you wish, <strong className="text-gray-700">you can take the screening test again</strong> or try Other cognitive activities.
          </p>
          <hr class="my-4 border-t-2 border-gray-600" />
          <p>
          පහතින්, අපි උපදෙස් සහ පුහුණු ක්‍රියාකාරකම් යෝජනා කරමු. ඕනෑම එකක් තෝරාගෙන ඔබේ දරුවාට කිරීමට 
          මඟ පෙන්වන්න. ක්‍රියාකාරකම් සම්පූර්ණ කිරීමෙන් පසු, ඔබට අවශ්‍ය නම්, 
          ඔබට නැවත පරීක්ෂණයට පෙනී සිටිය හැකිය, නැතහොත් වෙනත් සංජානන ක්‍රියාකාරකම් උත්සාහ කළ හැකිය.
          </p>
        </div>
        <div className=" text-left text-[15px] text-[#5c4033] font-bold bg-[#F2E6D9] p-3 rounded-md mb-4 leading-relaxed text-base leading-10">
        <div className="mx-20"></div>
 
  ⏳&nbsp;&nbsp;&nbsp;Break tasks into smaller, manageable parts to match Your Childs's attention span and reduce frustration; allow breaks and split work over time when needed./ ඔබේ &nbsp;&nbsp;&nbsp;&nbsp;දරුවාගේ  අවධානයට ගැළපෙන පරිදි සහ කලකිරීම අඩු කිරීම සඳහා කාර්යයන් කුඩා, කළමනාකරණය කළ හැකි කොටස් වලට බෙදන්න; අවශ්‍ය විටෙක &nbsp;&nbsp;&nbsp;&nbsp;විවේක ගැනීමට සහ කාලයත් සමඟ වැඩ බෙදා ගැනීමට ඉඩ දෙන්න. <br /><br />
  🌟&nbsp;&nbsp;&nbsp;Teach your child to recognize distractions and use positive self-talk like “I will stay focused” to stay on task. / ඔබේ දරුවාට අවධානය වෙනතකට යොමු කරන &nbsp;&nbsp;&nbsp;&nbsp;දේවල් හඳුනා ගැනීමට උගන්වන්න සහ කාර්යයේ රැඳී සිටීමට "මම අවධානයෙන් සිටිමි" වැනි ධනාත්මක ස්වයං-කතාවක් භාවිතා කරන්න.<br /><br />
  🏆&nbsp;&nbsp;&nbsp;Set clear expectations with your child using simple rules and a written agreement. Give time limits for tasks and use rewards to motivate focus and good behavior. / සරල &nbsp;&nbsp;&nbsp;&nbsp;නීති සහ ලිඛිත ගිවිසුමක් භාවිතා කරමින් ඔබේ දරුවා සමඟ පැහැදිලි අපේක්ෂාවන් සකසන්න. කාර්යයන් සඳහා කාල සීමාවන් ලබා දී අවධානය සහ යහපත් &nbsp;&nbsp;&nbsp;&nbsp;හැසිරීම පෙළඹවීම සඳහා ත්‍යාග භාවිතා කරන්න.<br /><br />
  🎯&nbsp;&nbsp;&nbsp;Establish a Consistent Routine / ස්ථාවර දින චර්යාවක් ස්ථාපිත කරන්න <br /><br />
  📍&nbsp;&nbsp;&nbsp;Create a Distraction-Free Study Space / අවධානය වෙනතකට යොමු නොවන අධ්‍යයන අවකාශයක් නිර්මාණය කරන්න <br /><br />
  ⏱&nbsp;&nbsp;&nbsp;Gradually build attention skills by starting with one-step instructions and increasing to multi-step tasks, rewarding the child for sustained focus over progressively longer &nbsp;&nbsp;&nbsp;&nbsp;periods. / එක්-පියවර උපදෙස් වලින් පටන් ගෙන බහු-පියවර කාර්යයන් දක්වා වැඩි කිරීමෙන්, ක්‍රමයෙන් දිගු කාලයක් අඛණ්ඩව අවධානය යොමු කිරීම සඳහා &nbsp;&nbsp;&nbsp;&nbsp;දරුවාට ප්‍රතිලාභ ලබා දීමෙන් අවධානය යොමු කිරීමේ කුසලතා ක්‍රමයෙන් වර්ධනය කරන්න.  <br /><br />
  🧠&nbsp;&nbsp;&nbsp;Practice Mindfulness and Relaxation / සිහිකල්පනාව සහ විවේකය පුහුණු වන්න<br /><br />
  🎮&nbsp;&nbsp;&nbsp;Give your child to Play Attention-Boosting Games / ඔබේ දරුවාට පහත දැක්වෙන අවධානය වැඩි කරන ක්‍රීඩා කිරීමට දෙන්න<br /> 
  <div className="text-left text-[20px] text-[#5c4033] bg-[#F2E6D9] p-3 rounded-md mb-4 mx-20 leading-relaxed text-base leading-10">
  •{" "}
  <a href="https://www.mathsisfun.com/games/simon-says.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
  Simon Says 
  </a>
  <br />
  •{" "}
  <a href="https://www.mathsisfun.com/games/ninja/balloon/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
  Balloon Pop
  </a>
  <br />
  •{" "}
  <a href="https://www.mathsisfun.com/games/flippa-memory-game.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
  Flippa Memory Game
  </a>
  <br />
  •{" "}
  <a href="https://www.mathsisfun.com/games/ninja/alpha/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
  Alpha Twist
  </a>
  <br />
  •{" "}
  <a href="https://www.mathsisfun.com/games/arrange.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
  Arrange Puzzle Game
  </a>
  <br />
  •{" "}
  <a href="https://www.mathsisfun.com/games/ninja/bottle/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
  Bottle Bash
  </a>
  <br />
  •{" "}
  <a href="https://www.mathsisfun.com/games/finding-bugs.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
  Finding Bugs Game
  </a>
  <br />
  •{" "}
  <a href="https://www.mathsisfun.com/games/math-match-game.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
  Math Match Game
  </a>
  <br />
  •{" "}
  <a href="/improve-attention" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
  NeuroAssist Improve Attention Game
</a>


  
    
  </div>
</div>
<button 
            className="bg-green-600 text-white px-4 w-[10%] py-3 text-lg rounded-md mt-4 hover:bg-green-700 transition"
            onClick={() => window.location.href = '/go'}
          >
            Retest
          </button><br/>
    
      </div>
    </div>
  );
  
};

export default AttentionAdvice;
