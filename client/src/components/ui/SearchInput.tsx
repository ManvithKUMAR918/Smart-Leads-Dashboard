import { type InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  /** Optional extra classes on the outer wrapper */
  wrapperClassName?: string;
}

const SearchInput = ({ wrapperClassName = '', ...inputProps }: SearchInputProps) => {
  return (
    <div className={`relative w-full ${wrapperClassName}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-zinc-400" />
      </div>
      <input
        {...inputProps}
        style={{ paddingLeft: '2.75rem' }}
        className="w-full pr-4 py-2.5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60"
      />
    </div>
  );
};

export default SearchInput;
