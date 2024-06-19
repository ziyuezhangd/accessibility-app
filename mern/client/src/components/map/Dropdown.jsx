import { useState } from 'react';
import { Control } from 'react-google-map-wrapper';
import { AiOutlineCaretUp, AiOutlineCaretDown } from 'react-icons/ai';
import list from '../../list.json';

function Dropdown({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select Heatmap'); 

  const handleSelect = (item) => {
    onSelect(item);
    setSelectedOption(item.name);
    setIsOpen(false);
  };

  return (
    <Control position={google.maps.ControlPosition.TOP_LEFT}>
      <div className='relative flex flex-col items-center w-[340px] h-[340px] rounded-lg'>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className='bg-blue-400 p-4 w-full flex items-center justify-between font-bold text-lg rounded-lg tracking-wider border-4 border-transparent active:border-white duration-300 active:text-white'
        >
          {selectedOption}
          {!isOpen ? (
            <AiOutlineCaretDown className='h-8' />
          ) : (
            <AiOutlineCaretUp className='h-8' />
          )}
        </button>
        {isOpen && (
          <div className='bg-blue-400 absolute top-20 flex flex-col items-start rounded-lg p-2 w-full'>
            {list.map((item, i) => (
              <div
                className='flex w-full justify-between p-4 hover:bg-blue-300 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4'
                key={i}
                onClick={() => handleSelect(item)}
              >
                <h3 className='font-bold text-lg'>{item.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </Control>
  );
}

export default Dropdown;
