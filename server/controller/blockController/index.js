const Block = require("../../model/block/index");


const registerBlock=async (req, res) => {
 
   try {
    
    const {
        blockNum ,
        foundIn,
        isSelectedForSpecialStud,
        floors,
        totalFloors
         } =req.body; 
    
    const newBlock=new Block({
        blockNum ,
        location:foundIn ,
        isSelectedForSpecialStud ,
        [floors]:floors,
        totalFloors
    })

    await newBlock.save();
    res.status(200).json({
        success: true,
        message: "Block Registered Successfully",
      });


   } catch (error) {
    res.status(500).json({
       success:false,
       message:"register Block Failed" ,
       error: error.message
    })
   }
}

module.exports={registerBlock};