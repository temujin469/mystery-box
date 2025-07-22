import { useCallback } from 'react';
import { toast } from 'sonner';
import { UnlockedAchievement } from '@/types/box';

export const useAchievementNotifications = () => {
  const showAchievementNotifications = useCallback((achievements: UnlockedAchievement[]) => {
    if (!achievements || achievements.length === 0) return;

    achievements.forEach((achievement, index) => {
      setTimeout(() => {
        toast.success(
          `🏆 Амжилт: ${achievement.name}!`,
          {
            description: achievement.description,
            duration: 6000, // Show longer for achievements
            action: {
              label: "Үзэх",
              onClick: () => {
                // Navigate to achievements page
                // You can add router navigation here
                window.location.href = '/profile/achievements';
              },
            },
            className: 'achievement-notification',
            style: {
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              border: '1px solid #F59E0B',
              color: '#92400E',
            },
          }
        );
      }, 1000 + (index * 500)); // Stagger achievement notifications
    });
  }, []);

  const showSingleAchievementNotification = useCallback((achievement: UnlockedAchievement) => {
    toast.success(
      `🏆 Амжилт: ${achievement.name}!`,
      {
        description: achievement.description,
        duration: 6000,
        action: {
          label: "Үзэх",
          onClick: () => {
            window.location.href = '/profile/achievements';
          },
        },
        className: 'achievement-notification',
        style: {
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          border: '1px solid #F59E0B',
          color: '#92400E',
        },
      }
    );
  }, []);

  return {
    showAchievementNotifications,
    showSingleAchievementNotification,
  };
};

export default useAchievementNotifications;
