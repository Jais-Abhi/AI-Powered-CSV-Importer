const uploadCSV = (req, res) => {
  // Handle CSV upload logic here
  res.send("CSV upload endpoint");
  console.log(req.file)
  console.log("buffer--------",req.file.buffer)
};

export { uploadCSV };