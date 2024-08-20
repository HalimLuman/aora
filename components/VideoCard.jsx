import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import { getSavedPosts, saveVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import useAppwrite from "@/lib/useAppwrite";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
  id
}) => {
  const { user } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const submitSave = async() => {
    try{
      await saveVideo({
        userId: user.$id,
        videoId: id,
      });
      setOpenMenu(false);

      Alert.alert("Success", "Save status changed succesfully");
    }catch(error){
      console.log(error);
    }
  }
  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-xl border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-3">
            <Text
              className="text-white font-extrabold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-gray-100 font-semibold text-xs"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <TouchableOpacity className="py-2 px-2" onPress={() => setOpenMenu(!openMenu)}>
        <View >
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
          {openMenu && (
            <TouchableOpacity onPress={submitSave} className="z-20 absolute right-8 rounded-lg border border-gray-400 -top-2 w-[80px] h-[40px] flex justify-center items-center bg-gray-800 drop-shadow">
              <Text className="text-white text-md font-semibold">Save</Text>
            </TouchableOpacity>
          )}
        </View>
        </TouchableOpacity>
      </View>
      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if(status.didJustFinish){
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
