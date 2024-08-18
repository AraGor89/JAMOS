"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ProgressBar from "../progressBar/ProgressBar";
// import { useToast } from "@/providers/tosterProvider";
import { useUserContext } from "@/hooks/useUserContext";
import { fetchUserProfile } from "@/libs/axiosApi/getUserProfile";
import AddCharacteristic from "../addCharacteristic/AddCharacteristic";
import { sendPartnerRequest } from "@/libs/axiosApi/sendPartnerRequest";
import { editCharacteristics } from "@/libs/axiosApi/editCharacteristic";
import { deleteCharacteristic } from "@/libs/axiosApi/deleteCharacteristic";
import {
  UserT,
  PartnerT,
  PartnerStatusE,
  CharacteristicT,
  CharacteristicFormT,
} from "@/types/common";
import { deletePartnership } from "@/libs/axiosApi/deletePartnership";
import CustomModal from "../modal";
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Button,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";

const mockImg =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=";

const Profile = () => {
  // const { success, error: tostError } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const { profileId } = useParams();
  const queryClient = useQueryClient();
  const ownerProfileData = useUserContext();
  const [profileData, setProfileData] = useState<UserT | {}>({});
  // const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isCreatingChar, setIsCreatingChar] = useState(false);
  // console.log("profileData", profileData);
  const {
    _id,
    name,
    email,
    surname,
    partners,
    notifications,
    characteristics,
  } = profileData as UserT;
  // const isUserProfileLoading = profileData.isUserProfileLoading;
  const {
    error: profileDataError,
    isLoading,
    isSuccess,
    data: profileDataRes,
    refetch,
  } = useQuery<UserT, Error>({
    queryKey: ["userProfile", profileId],
    queryFn: async () => await fetchUserProfile(profileId as string),
    refetchOnWindowFocus: true,
    //  staleTime: 0,
  });

  // TODO: handle isPending, isError, isSuccess
  const {
    mutate: deleteCharMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: (character: string) => deleteCharacteristic(_id, character),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", _id],
      });
    },
  });

  // TODO: handle isPending, isError, isSuccess
  const {
    mutate: deletePartnershipMutation,
    // isPending,
    // isError,
    // error,
  } = useMutation({
    mutationFn: (id: string) => deletePartnership(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", ownerProfileData?.userProfile?._id],
      });
    },
  });

  // TODO: handle isPending, isError, isSuccess
  const { mutate: editCharMutation } = useMutation({
    mutationFn: (data: CharacteristicFormT) => editCharacteristics(_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", _id],
      });
    },
  });

  // TODO: handle isPending, isError, isSuccess
  const { mutate: sendPartnerRequestMutation } = useMutation({
    mutationFn: (userId: string) => sendPartnerRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", ownerProfileData?.userProfile?._id],
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setProfileData(profileDataRes);
    }
    if (profileDataError) {
      router.push("/not-found");
    }
  }, [isSuccess, profileDataRes, profileDataError]);

  const isMyPage = profileId === ownerProfileData?.userProfile?._id;
  const currentPotentialPartner = ownerProfileData?.userProfile?.partners?.find(
    (item: PartnerT) => item.user === profileId
  );
  const isPartnerPage =
    currentPotentialPartner?.status === PartnerStatusE.accepted;
  const isRequestedPartner =
    currentPotentialPartner?.status === PartnerStatusE.pending;
  // const isRejectedPartnerPage =
  //   currentPotentialPartner?.status === PartnerStatusE.rejected;
  const isFisrtContact = !isMyPage && !isPartnerPage && !isRequestedPartner;
  const isMyOrPartnerPage = isMyPage || isPartnerPage;

  const handleDeleteChar = async (character: string) => {
    try {
      deleteCharMutation(character);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePartnershipRequest = async () => {
    try {
      sendPartnerRequestMutation(profileId as string);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleEditChar = async (character: string, value: number) => {
    editCharMutation({ character, value });
  };

  const handleCloseModal = () => setOpenModal(false);
  const handleDeletePartner = async () => {
    deletePartnershipMutation(profileId as string);
    setOpenModal(false);
  };

  if (isLoading) {
    return (
      <CircularProgress
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  }

  return (
    <Typography component="div" style={{ padding: "10px" }}>
      <CustomModal
        openModal={openModal}
        positiveCB={handleDeletePartner}
        handleCloseModal={handleCloseModal}
      />
      <Paper
        style={{
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5", // theme.palette.primary,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          component="div"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Typography
            component="div"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Image
              src={mockImg}
              alt={`${name} ${surname}`}
              style={{ marginRight: "16px" }}
              width={48}
              height={48}
            />
            <Typography component="div">
              <Typography
                variant="h6"
                style={{ fontWeight: "bold" }}
              >{`${name} ${surname}`}</Typography>
              {/* <Typography variant="body2" style={{ color: '#888' }}>Email: {email}</Typography> */}
            </Typography>
          </Typography>
          <Typography
            component="div"
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {isFisrtContact && (
              <Button
                size="small"
                variant="contained"
                onClick={handlePartnershipRequest}
              >
                Request partnership
              </Button>
            )}
            {isRequestedPartner && (
              <Chip
                color="primary"
                label={`Partnership status: ${currentPotentialPartner?.status}`}
              />
            )}
            {isMyOrPartnerPage && (
              <Button
                size="small"
                variant="contained"
                onClick={() => setIsCreatingChar(!isCreatingChar)}
              >
                {isCreatingChar ? "Cancel" : "Add Characteristic"}
              </Button>
            )}
            {isPartnerPage && (
              <Button
                size="small"
                color="secondary"
                onClick={() => setOpenModal(true)}
              >
                Delete partnership
              </Button>
            )}
          </Typography>
        </Typography>
        {isMyOrPartnerPage && isCreatingChar && (
          <AddCharacteristic user={profileData as UserT} />
        )}
      </Paper>
      {isMyOrPartnerPage && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 600, fontSize: "18px", m: "15px" }}
          >
            Characteristics
          </Typography>
          {characteristics?.map((character: CharacteristicT) => (
            <Typography component="div" key={character?.character}>
              <ProgressBar
                character={character}
                handleEditChar={handleEditChar}
                handleDeleteChar={handleDeleteChar}
              />
            </Typography>
          ))}
        </Box>
      )}
    </Typography>
  );
};

export default Profile;
