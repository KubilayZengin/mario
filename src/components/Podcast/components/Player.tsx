import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRewindBackward10,
  IconRewindForward10,
} from '@tabler/icons-react';
import React, { useEffect, useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { PodcastMetadata } from '../';
import { Palette } from '@vibrant/color';
import { getShade } from '../../../helpers/formatChart';
import { motion } from 'framer-motion';
import { colors } from '../../../style/theme';

const PlayerRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const CoverArt = styled.div`
  user-select: none;
  display: flex;

  @media (max-width: 700px) {
    align-items: center;
    justify-content: center;
  }
`;

const CoverImage = styled.img`
  width: 150px;
  min-width: 150px;
  max-width: 150px;
  height: 150px;
  min-height: 150px;
  max-height: 150px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 27px 8px 0px rgba(0, 0, 0, 0),
    0px 17px 7px 0px rgba(0, 0, 0, 0.01), 0px 10px 6px 0px rgba(0, 0, 0, 0.05),
    0px 4px 4px 0px rgba(0, 0, 0, 0.09), 0px 1px 2px 0px rgba(0, 0, 0, 0.1);

  @media (max-width: 700px) {
    width: 70%;
    min-width: 70%;
    max-width: 70%;
    height: unset;
    min-height: unset;
    max-height: unset;
  }
`;

const AudioContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 700px) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  font-size: 16px;
  line-height: 1.3;
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 700px) {
    align-items: center;
    text-align: center;
    justify-content: center;
  }
`;

const TitleSeparator = styled.span``;

const ShowTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  opacity: 0.5;

  @media (max-width: 700px) {
    align-items: center;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    ${TitleSeparator} {
      display: none;
    }
  }
`;

const EpisodeTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: 600;
  font-size: 17px;

  @media (max-width: 700px) {
    text-align: center;
    justify-content: center;
  }
`;

const AudioControls = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PlayButton = styled(motion.button)`
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  min-width: 54px;
  max-width: 54px;
  height: 54px;

  background-color: ${colors.content.primary};

  svg {
    width: 30px;
    height: 30px;
    fill: ${colors.surface.layer};
  }
`;

const AudioProgress = styled.div`
  flex-grow: 1;
  position: relative;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
`;

const ProgressFilled = styled.div`
  height: 100%;
  width: 0%;
  background-color: ${colors.content.accent};
  border-radius: 2px;
  position: absolute;
  top: 0;
  left: 0;
  transition: width 0.1s;
`;

const AudioSubControls = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 6px;
`;

const AudioButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  &:active {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const SpeedButton = styled(AudioButton)`
  height: 28px;
  min-height: 28px;
  max-height: 28px;
  font-weight: bold;
  font-size: 11px;
  width: auto;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AudioTime = styled.div`
  user-select: none;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin-top: 4px;
  color: #6d6d6e;
  line-height: 1;
  font-variant-numeric: tabular-nums;
`;

const AudioTimeSeparator = styled.div`
  display: flex;
  width: 1px;
  min-width: 1px;
  max-width: 1px;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
`;

const PodcastPlayer = ({
  imageUrl,
  audio,
  metadata,
}: {
  imageUrl: string;
  audio: string;
  metadata: PodcastMetadata;
}) => {
  // Audio state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);

  // Speeds array
  const speeds = [0.75, 1, 1.25, 1.5, 2, 2.5];
  const [speedIndex, setSpeedIndex] = useState(1); // Start with 1.0x speed

  // Format time in minutes and seconds
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Play/pause toggle
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 10,
      );
    }
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration || 0,
        audioRef.current.currentTime + 10,
      );
    }
  };

  // Toggle playback speed
  const toggleSpeed = () => {
    const newSpeedIndex = (speedIndex + 1) % speeds.length;
    setSpeedIndex(newSpeedIndex);
    setPlaybackRate(speeds[newSpeedIndex]);

    if (audioRef.current) {
      audioRef.current.playbackRate = speeds[newSpeedIndex];
    }
  };

  // Seek to position when clicking on progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  // Update audio time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100,
      );
    }
  };

  // Set audio duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle audio end
  const handleEnded = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.addEventListener('ended', handleEnded);

      return () => {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener(
          'loadedmetadata',
          handleLoadedMetadata,
        );
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  return (
    <PlayerRow>
      <CoverArt>
        <CoverImage
          src={`${imageUrl}?fm=auto&w=450&h=450`}
          alt={metadata.podcastTitle}
        />
      </CoverArt>

      <AudioContainer>
        <audio ref={audioRef} src={audio} preload="metadata" />

        <Title>
          <ShowTitle>
            <span>{metadata.podcastTitle}</span>
          </ShowTitle>
          <EpisodeTitle>{metadata.episodeTitle}</EpisodeTitle>
        </Title>

        <AudioControls>
          <PlayButton
            onClick={togglePlayPause}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1.12 }}
          >
            {isPlaying ? <IconPlayerPauseFilled /> : <IconPlayerPlayFilled />}
          </PlayButton>

          <AudioProgress>
            <ProgressBar onClick={handleProgressClick}>
              <ProgressFilled
                style={{ width: `${progress}%` }}
              />
            </ProgressBar>

            <AudioSubControls>
              <AudioButton onClick={skipBackward}>
                <IconRewindBackward10 />
              </AudioButton>

              <SpeedButton onClick={toggleSpeed}>{playbackRate}X</SpeedButton>

              <AudioButton onClick={skipForward}>
                <IconRewindForward10 />
              </AudioButton>

              <AudioTime>
                <span>{formatTime(currentTime)}</span>
                <AudioTimeSeparator>&nbsp;</AudioTimeSeparator>
                <span>{formatTime(duration)}</span>
              </AudioTime>
            </AudioSubControls>
          </AudioProgress>
        </AudioControls>
      </AudioContainer>
    </PlayerRow>
  );
};

export default PodcastPlayer;
