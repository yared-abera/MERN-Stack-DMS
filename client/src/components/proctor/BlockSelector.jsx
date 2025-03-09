// components/BlockSelector.js


const BlockSelector = ({ onSelectBlock }) => {
  
 

  if (isLoading) return <div>Loading blocks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <select 
      onChange={(e) => onSelectBlock(JSON.parse(e.target.value))}
      className="block-selector"
    >
      <option value="">Select a Block</option>
      {blocks.map(block => (
        <option 
          key={block._id} 
          value={JSON.stringify({
            blockNum: block.blockNum,
            floors: block.floors
          })}
        >
          Block {block.blockNum} ({block.location})
        </option>
      ))}
    </select>
  );
};

export default BlockSelector;