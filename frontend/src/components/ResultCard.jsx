import { motion } from 'framer-motion';
import Progress from './Progress.jsx';

export default function ResultCard({ result }) {
  if (!result) return null;
  return (
    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="p-6 rounded-xl border bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">ATS Score</h3>
        <span className="text-2xl font-extrabold text-primary">{result.score}%</span>
      </div>
      <div className="mt-3">
        <Progress value={result.score} />
      </div>
      <div className="mt-4">
        <h4 className="font-medium">Improvements</h4>
        <ul className="mt-2 list-disc pl-5 text-gray-700">
          {result.improvements?.map((it, idx)=> <li key={idx}>{it}</li>)}
        </ul>
      </div>
      {result.linkedinBio && (
        <div className="mt-4">
          <h4 className="font-medium">LinkedIn Bio</h4>
          <textarea readOnly className="mt-2 w-full h-32 border rounded-md p-3">{result.linkedinBio}</textarea>
        </div>
      )}
    </motion.div>
  );
}
