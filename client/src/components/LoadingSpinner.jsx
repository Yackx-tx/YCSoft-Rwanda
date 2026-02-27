export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent  animate-spin" />
    </div>
  );
}
