import { Divider, Typography } from "@mui/material";
import ProgressBar from "../progressBar/ProgressBar";
import AddCharacteristic from "../addCharacteristic/AddCharacteristic";

const dummyChar = {
  character: "Romantic",
  value: 50,
  createdBy: "Jane Smith",
  updatedBy: "Jane Smith",
  createdAt: "2024-05-09T09:06:18.343+00:00",
  updatedAt: "2024-10-09T09:06:18.343+00:00",
};

export const dataArr = [
  {
    content: (
      <Typography component="p">
        <b>JAMOS</b> is an acronym which stands for
        <b>{" JUST A MATTER OF SETTINGS"}</b>.
      </Typography>
    ),
  },
  { content: "/illustration_01.svg" },
  { content: "/illustration_02.svg" },
  {
    content: (
      <>
        <Typography component="p">
          The motivation for creating this app is that often we struggle to talk
          about our feelings, thoughts and emotions with our close ones.
        </Typography>
        <Typography>This happens for a variety of reasons.</Typography>
        <Typography>
          It is very difficult to make a remark to a loved one and at the same
          time not to offend and ruin the relationship.
        </Typography>
      </>
    ),
  },
  {
    content: (
      <>
        <Typography component="p">
          If you have ever told your husband that he is not very neat, or your
          wife that she takes too long to get ready before leaving the house,
          then you know exactly what we are talking about.
        </Typography>
        <Typography component="p">
          If you have ever told your close one
        </Typography>
        <Divider />
        <Typography component="p">
          you should drink less... you are too aggressive... you are too
          cynical... ...
        </Typography>
        <Divider />
        <Typography component="p">
          then you know exactly this awkward state.
        </Typography>
      </>
    ),
  },
  { content: "/illustration_06.svg" },
  { content: "/illustration_04.svg" },
  {
    content: (
      <Typography component="p">
        These are all different human qualities.
        <Typography component="span">We all have some.</Typography>
        Therefore, we ourselves must be able to accept advice and
        recommendations from our loved ones.
      </Typography>
    ),
  },
  {
    content: (
      <Typography component="p">
        <b>JAMOS</b> suggests adding a little humor while conveying your
        concerns to your close ones <b>by turning it into matter of settings</b>
      </Typography>
    ),
  },
  { content: "/illustration_05.svg" },
  { content: "/illustration_03.svg" },
  {
    content: (
      <Typography component="p">
        Hope at this point you got the idea and we can move to more technical
        parts of the apps usage.
      </Typography>
    ),
  },
  {
    content: (
      <Typography component="p">
        We suggest an idea of partnership. Anyone can be a partner. Whoever is
        close to you. A friend, girlfriend, boyfriend, husband, wife. Cousin
        after all (why not😄)
      </Typography>
    ),
  },
  { content: "/illustration_07.svg" },
  { content: "/illustration_08.svg" },
  {
    content: (
      <Typography component="p">
        Let's assume that you would like your husband to be more attentive. You
        have already talked about this topic (more than once), but other than
        stress, it has not given you anything.
      </Typography>
    ),
  },
  {
    content: (
      <Typography component="p">
        Here you can create characteristics for each other with a value from
        0-100. <br /> Where the extreme values (0 and 100) are not good. You
        need to strive for the golden mean (50😍)
      </Typography>
    ),
  },
  {
    content: (
      <Typography component="div" style={{ textAlign: "left" }}>
        {/* @ts-ignore */}
        <AddCharacteristic />
      </Typography>
    ),
  },
  {
    content: (
      <Typography component="div" style={{ textAlign: "left" }}>
        <ProgressBar
          //  @ts-ignore
          character={dummyChar}
          handleEditChar={(e) => console.log("edit", e)}
          handleDeleteChar={(e) => console.log("delete", e)}
        />
      </Typography>
    ),
  },
  {
    content: (
      <Typography component="div">
        And of course you can edit and/or delete it whenever you want.
      </Typography>
    ),
  },
  {
    content: (
      <Typography component="div">
        All your changes will be visible to your partner and one will know what
        quality you would like him to work on.
      </Typography>
    ),
  },
];

export const reOrderData = (index: number) => {
  // Convert 1-based index to 0-based for easier calculations
  const zeroBasedIndex = index - 1;
  // Determine the zero-based position for swapping
  if ((zeroBasedIndex + 1) % 4 === 3) {
    // For indices like 2, 6, 10 (zero-based 3, 7, 11), swap with the next one
    return zeroBasedIndex + 2;
  } else if ((zeroBasedIndex + 1) % 4 === 0) {
    // For indices like 3, 7, 11 (zero-based 4, 8, 12), return the previous index
    return zeroBasedIndex - 1;
  } else {
    // For all other indices, stay the same
    return zeroBasedIndex;
  }
};
