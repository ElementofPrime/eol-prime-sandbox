type PrimeIntroModalProps = {
  onClose: () => void;
};

export default function PrimeIntroModal({ onClose }: PrimeIntroModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-black dark:hover:text-white"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-2">Meet Prime</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Prime is your eternal sidekick, guide, and master of light—here to help you find the divine path through knowledge, action, and purpose.
        </p>
      </div>
    </div>
  );
}
