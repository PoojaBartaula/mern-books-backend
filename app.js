require("dotenv").config(); // to use .env...secure garxa
const express = require("express");
const connectToDatabase = require("./database");
// const Book = require('./model/bookModel');
const fs = require("fs");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const Book = require("./model/bookModel");
const { multer, storage } = require("./middleware/multerconfig");
const upload = multer({ storage: storage }); //multer confiuration for file uploads.
const cors = require("cors");

app.use(express.json()); //express le json handle garna sakdaina....so this function is for it to use json and understand

connectToDatabase();

//app.get("/path",(request,respond))
app.use(cors({ origin: "*" }));
app.get("/postman", (req, res) => {
  //abc= request, add= respond
  res.send("Hello World");
});
app.post("/book", upload.single("image"), async (req, res) => {
  // console.log(req.body);
  let fileName;
  if (!req.file) {
    fileName =
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA3wMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAQIDBQYABwj/xAA6EAACAQMDAgUDAgQDCAMAAAABAgMABBEFEiExQQYTIlFhFDJxgZEHI0JSodHwFSQzQ2KCscFT4fH/xAAaAQACAwEBAAAAAAAAAAAAAAABAgADBAUG/8QAIxEAAgICAgIDAQEBAAAAAAAAAAECEQMSBCETMSJBUTIUBf/aAAwDAQACEQMRAD8AP8wh8in+e3vQxbnFcDXd1PG7sI81s81KlywXAJHNCA04Ghqh4zdlvFfFVGCaSe/dlIPIqtDkURDIpGGFV6L2aY5pNVZFkP8AFOEaDrmpJQmQQBikRonGCCCKZFenfY9DGgyFomCU/wBJxVeSVPXipUeRcHGR8UriPGdMuIp+fUcU4zMCdp4qtEuV4OD81GszgkZqvTs0+Us/qWWpFnfqTxVWJAwySc043AU8E1PGHylkl0uCGJpxcMPS371V/UbjlsD8U6Sd8ZHQUPGTzIMbk4NCXDYOQ/A7UM9y5GCaiZt3WrIwKp5k10SPJnpXRR72yaiB55qZHx0p2qKo032WEEK8cVZ26gJ+Kp7d3JqwikKjms00bsTRZxPjnNTCWq1WLDJqYEr3qlxNSmWCyg96cHyarN56gmpYpSOtK4jqZYhqQtmhPOJFNacgd6XUfc86P3Uuaazc0ma7J5DZD80oamDmnYqUOmyUNxTQ5HINWujWVvPA8043YbCg/vVxHpFjNGf93VWbkFe1ZpciMXR0MfBy5IbpmZjEsiM4UlUGWPYVNHEJsEED3qx1eCOy07yrYYSWUmQ55OPtH4qkBPQH9qeD3VoqyQ8UtZdhksAUfdT7djGNrrkGgwSerGiYNuMb8mo10GMlfQWyoy5RfVUIiBB3NtapBOkYwT6qHuJxLxjFKky6UojHba/BzXMdy7gKiZhil3cYFOkZ9x6AMuc8ipSXEfUYoYewqdELjFRoaDsZjNdiio7RjTZYSnWhshtHVkG2nLwalSNnY7RnHUCkeMhsVLJq0TQuRwKPgYtjNV8QxRts+081TNGnGWKxNgNziudqntrlWAU1FdqSfSKz/ZtaWvRHGwyaeXyKjigfBz1qaO3Ypk0XQsbHRtxzSOQaUR7evWomO00Eh26Rg227uOtKOlLt9WadiuqeVim2TWVrJdy7EAAHLMewqwfSlRc+Yx/SodLnhgZhJwzdG/8AVWUzB1BRhg9Oaw58k1Lo73B42CeO5dsqrXUP9nJNvSRlB+0LkfmrvStZt7pjFA2QIw4J46n261V3DLDguwVuxJAzVZPq8FhvkEsauOcHHPFcnJnmsi7s73F4qcfHBGov3S6ZbMHkEO/H2iq3VbWK3jikt1CqfQRn270H4X1RNStrm4aVfOMhabjAUdF59uKtfp01GdQWdYYxjcB95J6CtvFzN9t9Iwf9Lh+NuFXL0UoNKjlSCOoq3m0J/p90Dlpc8occj81PY+Hs+u6l2gDlV5/xrf5oV7OIuJnTqiiZ3kfPvTmhkVdxBAo9Lc2+x5oiEY+lj0NWDCCWLGOcVHk/Ax47d7ezPgUtEXEJVjhajMEgXcUYD8U+yKXBoaKKhkWIFmDEDrtBJ/YVHFCSeRRkdnIeQrfoKSbXpl2GEruiNNa05baSU3kASMeobhuX/t61gNe8UT3twwtnMcC8BM8n81tNc0mK90+YSRgyopZW6MCPn9685j0uSfy7k4VkJAPPqHbI/wBc1TGE7+PZslPGlcugzSddmhmRvqACWOTkjA/Wt9peow6on3rvHGem74+a8+XT7VEy8CEg8spqy0q6WC4QQnZj2PartH9mbyxb6PQRAQeRXCN0k+KI0edNStQ24GReoHWrD6UP26Vnc6dG2OLZWgSFMjNWEADDDDpT4rYAc0SkQHSqJSNOPG0MaMFeKgkyg4Bqw2LTJIlNImWuJWZYt0NSm1D80X5S+wp4TAo7AUP08wxTgKXHqNcK7B5NDowu4F87e+O9W8QwqERJGmPsIyfzmqcCi472RVAK78d2JrPmxuS6N/D5EcT+QVIgZSGVdvf0g1V6joMdzP8AW36H6OzjMhRRzK/OBjvwP8aP+ubqsS8fJpJ3uLrZ5pIiJ6Z4Fc/Jx3XZ3uNz4udY2yvu7W11iwjeG9uNNypVo1UBXHsykZP71D4T1S7sXOj6jeRXcMTBLW4hIbZx9j45Untn8ZqzksWwAXyT7ihp7WKN0kEQ8xeA2MkL8H/QrJkmsSs3OTyfH2ayGcc7iPV0yepp31Uk00VlaQ7zgNO3RY1/Pufastpmqpc62lrLIqsI8RKD9znqfzioLLxMzapfwee8ETTFI1OAFK+k8/NNHPGVd12Jk488Key+rNTr9ymVtoVVtuN2D9uO1AWNpPdzbIj+Sal06wN3cLGHBzyTnNaW101bA7kfcT1roPJGEaRxo4Z5p7SVIgtNJggIac75PY9Kt/Jt3TaYUx+KEOc5NT25ORmskpN9nQjCEekhRpVpu3+UM+1ELbQhdojUA8VKp4pGYAZJpdpMs1ivowfi29ttLnNmDmWVc8DO0VhZR5UPpm2KftUnn44qbXNRmvNbvr2bOVJCDGQBngfsP8aoruSRpyDIDI3U/FdzBWPH+s81yW8mT8Q97S8knEQtmaJxnzInwB+afHp1mWCyiWNlP/yHr+vFPsZ7sRiPdtfs/Y/kf+/en/Ux3ztDcOsVxGQrB/S2fkVkyTlt2asWOOtov9Dlm06aKRJmeMHADe3sfivS7fZNCksf2sMivHo4LuJzGJC6suCuf2IrV+DvF8NsyaRrbfT3BOInkGFf9f2qnIm1ZrwSUXTNwV5qRBUpQHnsenNcBis1m6hAo70u2lpwWhY9DBGPan7BTgKU9KlkpHlyoG7Vxhz9oq2XTWjJOeKkFtj/APK6vlX0eaXGl9oojEw60ohYjirz6XP9Oactl7rip5if5G2VNnCWuFDJnGTR0v8AbjPai/oduSuQfemG1kyCB0rPle7OhxEsMaBUtwkbbt+5jnh8Y4xj/Cq64s1js7hgXlkEbEbjnnHatALSSTG44/Sj7TT0CMOrEYyfask8UX7OjDN2pIzPh7QYbW2iUwq04AaSYjLF+/NT33g7R7uaW4u4mEs2A8iysvQY7GtMfJs4iSvC9fiqbVNQSU7IdpVBk/n2pFLHFaFk3lyS8lsw8mh+I/B+otq2mTfU2bHbI0I3MI8+kuvfjGSK9Nt9dt9ttHqTpbXVwo2Ln0ucAnB/Xv8AvXWIkitAsmA27GQegND6nYWF6Fju4RJs5Q5wyn3BHSmUEvRN3L+i5LBjj2qWA8jFUFmLmwEcSyG6td2CZD/MjH5/qH5GcdzRkmoMhHlouB796lAcdS+Z8YppYNwe/FBR3QnRXXOPY9qIhJJyaWg2ePeLLA6VqF+rNxIQIB7+3+dZx2iaYwqW3wxhEdv6zker8f517Z4s8KW/iWONZZDE0YPqUf6+a8J1TTZdI8QXGn37MNjtGHPHpHKn9sGt+LOpKvs5fI47Um/ocb2W2ufK6OCMA857cfGcUe722sQiOdfp72Ify5UHqT4+R8GqmeJbm03F13RLnd74NV9zdzSSBozldoGe4NDIxcUPzo01pPNCnl3M/wDOQkRyDhXPt8GpvEcI13TR5QEWpWvrWPP3j4Pesgt5dgH6a5cH+wng/p706LxA1tMkV6kilDlXU8ofcHrj/XNI3SoujC3aZ7B/CDxVJrlnJY3jsbiBQQr8nHx8V6NtryD+F17BD4huLllR457bJkT/AJZyMuB7H+r2IB717DkEZBBHuKzS9m3H/ImMUtIa7NKWC1xNJmuoksp2iHcVE8KkcCry5tsrlMVX7OasUzPLGgNIMU8QZPU0WI6kWOo5gWJAf0bN3NTR2YA5ooA09Rilc2WLHEHaGOONpJCAijLE9hVRPrqwyFEtgyg4B39R79K0JAZcMAQeoPeqy60iyKmQRKoUEkYJoKX6M4pejL+INS+sjUwRFXJw4eTIwPbjrVPZ/USXccQhkdCw3HsB35rRGQeVmGFI/kKKqpNasdKt2jvphGdxYyySZ3E+5PNVyxRvb0WY5v1RdahCbsqWn9CHKx49Ofn3oR9SK3BhnXYy9DjAb8VTr4gtrlg1hNJc5HIiiZsfsKkluHuxsFpKzdf5iED85xS5sqhG4vsCi26ZbLeu+oW8SsQhR2bng+1FyyruI3DjrzWLurmW2R3SOUhTtYrhlQ/6xVxoKabNbJeWbee5ODIxO5T3GO1U8bPkm3svZsy8XTGp2H6R4w0x9QmsjIQiAH6j/llvb/76VsEk5GKzbRl8ekEn+7vWcu/FepeF7xLe9sJXtnlIRX6heuFfofgVsl17MCPVITkCqLxj4Q0/xVYtDdfypgP5c6D1LyP3HGKTTvF2izxRb71LeR8AR3HoYMe3tn9a0QbIyCCD0+aS6doZpNUzwXU/4S6/p9+kemXUVxZFSfNlbaEz9wYe3U1nrHwjrdy1hFaQROmoSOttMsnpdEJzJ0yExg575HuK948XSyXv03h60kKzakT58iHBhtl5kb4J4QfLU/QraO5v59QiRVtIF+isVHQIv3sPywx+EFOsskVvDFnio/hp4oFxIj2cZ2jcHEnDD4+aG1j+Hfie0WGe7s4prV/Q7wvu8sE8M4xkD55r6KldYkeSQ+lRnNCvqtmgVsuQe4XpTPJKSoCwxi7PmKAav/D/AF+1mvrfdGGEsTRyZjmA43I4+Dj9RmvprQ9Qt9V0e11Czl82CeMOjdDj2PyOlVWt6foetaNLYanbJcWxclAqjMZOcMp7H5HvXnOiazc/wy1J9NvDNdaBMxaB9vKe5A/u/uXv1HcCstPaTzTdw7c1R2mrfXRLPaXImglUMjrgqwPPFWdpnDD5pqpEsKFcaSl7UCBJGVIquaPDmrIjIod4CTnNKnQWgcLinDpTjEV+aVYye9GwUJmkzSupXrUeSW4qEHFsVJGQwIbpSCMEfNMD7WqMNGZ8R6LdSTqmnOY4SrNKSD6fYDHXP+GKxuraHZ3nlm5tVlaL0AEkZz2JzzmvWZGBGRWWvtOlXUBJBD/L3bs7u+Pz/wCqrcPlswp16G20draW0UNvHFaIqgLGigAfAx1p7xhk9auM9DmmT259PmA71kRlz2III/8AFHyQyS5GAD75q+rEteyrhtorWLyII/Qc8f3E9SagcafpUohS3W3knG8sqcMckdR3q4Nq0UTSv1HtVdqKG5lhuUbbLAfSCOGU9QaSapLUsxz97voudMYPFyoyO9Hy21veRGK7t4p4+uyVAwz+DWcdmQh4yVOOoNX+j3f1MHr/AOKvDcdfmmkmVpqyn1zwBoWrtFI8Ulu8TBgYm4J+VPFU9/o/iTw5G0+k62Z7cEjyJIsnnp6c4PPtXoO6uCg9h+1VjnkPneMdP1LUL2YmS9uoREzzQgBEAONpH2DOT8ntWq8Batcmxgt9Qu7aEQARCA8k47h8Ae3HPfmtmYBG7yDHqxu/SqXUxod0ds0QkkHSS3GGX9Rx/wCagDJXHjuz1HV57RvNs4w5jTz22iQqSOnQA4yKlurwQR5L8PhY1z9xPYVGfB19qV5dCRYZ9NfHkJcxgYX/AKuuT+KqtS8Lw6a4geOJgn2iGXcE/Tqv7U3dURa3bNEskkMUcc7Avt5K9PwKGvYLbUYHsr6FJoJByjjOfn81n77WpLC3XzYpLoFtq7Vwygnv70ZFeu38sGNXY4DnIA+elVPJJNKh1FMk8F2R0VbyG2mdrRpMxxyEnym/q5PXNayzuniuTndI4TOCeKyk1+uj6a4S4hkmtlAbALbSecmgNO8SajaWs0zW5vS8hBkiwy49zjkCkWfSoyVln+dtNnqmn3MlwGLqAB8UWawHg7xrba9CyIGtryInfAW64PUZ61u7eYXEIcAg9wa02n2jO4tOmHLSnpSdKQtxSDDGGTTfgUhbmk3CoQeQNhLc0KrgSHHSpZZgF29SaiVR7UQEzyoq8nmgi2STRJgD896he3dahH2dGAeprp9oQ5GQBSLG4rmye1QhVQwO1y1xKuOfSpqcZ3UQ61ECoNPZW0PIEsDRnjPeque3mRwDHuHxzR7P7VytUARwWiNbqkw9Qz35FG2cMdqCI9x3dcmoVPNTrQYyCVNTIwoQNinpJSFgdwykEZB7GgNUR7bTppNPgQzqvoAQHHPWio5RipA4JqEMSmtapayb5Wkx3WQcH96rNRulupmn2JHn7gnAz816JcW8M64miRwf7lBrHeI/D6NIfIhDQTHaFUcqf0ptuugJfpSrb/8ASOem6gtRsRFCBbWsstzIc/UZOyIDHVR1z7CjLeE2cIiklklZM7mlbLdeBWgtbN57cNCjSD3VeMUdbC3TMcyxJH/vCSIAMF2j6/kCqK5vdNd3Nqu6dQQJUjI6Docc9K9L/wBkXNwWUwv5fckYrB6RoNxPqeqXC3D2sTOVTy1GQc/PsKzzjNPVOzZxo4pwlu6aKOPRpr22juorC6NwyZf6d3wB8kHr/nR9sNctlKwTa1aO3UxbvUvbIINeg+F7e8eNrHUrgGaP/hTooCyL7EdQ1Xh0ST+q5x/2mrowgqM2X4ycV6NET6RUTNxUZlG0c0zzRnGaAghbmml+v4pzbR1NMl2tC2DmiBsFWcCTmrBGDqMGqNEBlyWHFWUEqIuA1RgiwvO2lMobihJpwF60Otxg9aFDWi0XHtTXUHjFCx3OB1pxulNQg9osiqyZdshFWH1IHXmgp3DtlehpoiSBya5Xp0oCkEGouCaYrCEaiEag146VKjcioFBfWmlsU5OUNDueaUsCBJ7Gp4pKCVWxnHFExHHWowphayZO2lYZ6UIsgV+tSGbjg0tBKOTwvEbl3+oYISCqFenvzV2sYspIfJGYW/luPY9jSCXPJrrmFLuDynLAbg3pOM4OaPol2GSgOpX34z7VjbuzmtmYPGyrnhgODWx7fimsuaMXQrVmStrC+3xSxRenIYNmtSenPWuApGot2CqByTsFQO7A8GurqUZ+geWVyTzTI5H9zzXV1Mir7I5+gOOc1Esjhhg11dRA/ZJLIzKcmo0c+9dXVAkiyNnrS+Y3vXV1Qg4yNjrUDTOOhrq6oBsjMrN1NPUnFdXUzFQ9GOalRjuFdXUBkHRk7KYP+JXV1KWIKzwBXOfQa6uqDAm40oc+9dXVBWSqTRCE8UldQYUEbyBSbia6uoBFYYU1ESa6uooDP//Z";
  } else {
    fileName = "http://localhost:3000/" + req.file.filename;
  }
  try {
    const {
      bookName,
      bookPrice,
      isbnNumber,
      authorName,
      publishedAt,
      publication,
      description,
    } = req.body;
    const imageName = fileName;

    const book = await Book.create({
      bookName,
      bookPrice,
      isbnNumber,
      authorName,
      publishedAt,
      publication,
      description,
      imageUrl: imageName,
    });
    res.status(201).json({
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Book creation failed",
      error: error.message,
    });
  }
});
// all read
app.get("/book", async (req, res) => {
  const books = await Book.find(); // return array ma garxa
  res.status(200).json({
    message: "Books fetched successfully",
    data: books,
  });
});

// single read
app.get("/book/:id", async (req, res) => {
  const id = req.params.id;
  const book = await Book.findById(id); // return object garxa

  if (!book) {
    res.status(404).json({
      message: "Nothing found",
    });
  } else {
    res.status(200).json({
      message: "Single Book Fetched Successfully",
      data: book,
    });
  }
});
// delete operation
app.delete("/book/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Delete image file only if it's stored locally (not external link)
    if (book.imageUrl && book.imageUrl.startsWith("http://localhost:3000/")) {
      const localHostUrlLength = "http://localhost:3000/".length;
      const imagePath = book.imageUrl.slice(localHostUrlLength);

      fs.unlink(`storage/${imagePath}`, (err) => {
        if (err) {
          console.error("Error deleting file: ", err);
        } else {
          console.log("Image file deleted successfully");
        }
      });
    }

    // Delete book from DB
    await Book.findByIdAndDelete(id);

    res.status(200).json({
      message: "Book Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
// update operation
app.patch("/book/:id", upload.single("image"), async (req, res) => {
  // Patch is used for update operation
  // patch le kunai pani field update garna sakxa

  const id = req.params.id; // kun book update garney id ho yo
  const {
    bookName,
    bookPrice,
    authorName,
    publishedAt,
    publication,
    isbnNumber,
    description,
  } = req.body;
  const oldDatas = await Book.findById(id); //old file lai upload garni
  let fileName;
  if (req.file) {
    let oldImagePath = oldDatas.imageUrl;
    console.log(oldImagePath);
    const localHostUrlLengths = "http:/localhost:3000".length;
    const newOldImagePath = oldImagePath.slice(localHostUrlLengths);

    fs.unlink("storage/$(newOldImagePath)", (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("file Deleted sucessfully");
      }
    });
    fileName = "http:/localhost:3000" + req.file.filename;
  }

  await Book.findByIdAndUpdate(id, {
    bookName: bookName,
    bookPrice: bookPrice,
    authorName: authorName,
    publication: publication,
    publishedAt: publishedAt,
    description: description,
    isbnNumber: isbnNumber,
  });
  res.status(200).json({
    // res.status(200) le 200 ko status code return garxa
    message: "Book Updated Successfully",
  });
});
app.use(express.static("./storage/"));

app.listen(process.env.PORT, () => {
  //yo last ma rakhni......process.env.PORT(write this in 3000)
  console.log("Nodejs is running on port 3000");
});
