export default function Footer() {
  return (
    <footer className="border-t border-navy-600 bg-navy-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Argentine Alpha. All rights reserved.</p>
          <p>Data provided for informational purposes only. Not investment advice.</p>
        </div>
      </div>
    </footer>
  );
}
