import { useState, useEffect } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

// project imports
import MainCard from 'components/MainCard';

// assets
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import DatabaseOutlined from '@ant-design/icons/DatabaseOutlined';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';
import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';

// hooks
import useMixpanelTracking from 'hooks/useMixpanelTracking';

const checklistItems = [
  {
    id: 'connect-data-source',
    title: 'Connect data source',
    description: 'Link your first data source to start analyzing',
    icon: DatabaseOutlined,
    autoComplete: () => {
      // Check if user has connected any data source
      // This would typically check API or local storage
      return localStorage.getItem('hasDataSource') === 'true';
    }
  },
  {
    id: 'invite-teammate',
    title: 'Invite a teammate',
    description: 'Collaborate better with your team',
    icon: UserAddOutlined,
    autoComplete: () => {
      // Check if user has invited team members
      return localStorage.getItem('hasInvitedTeammate') === 'true';
    }
  },
  {
    id: 'create-dashboard',
    title: 'Create first dashboard',
    description: 'Build your first data visualization',
    icon: DashboardOutlined,
    autoComplete: () => {
      // Check if user has created a dashboard
      return localStorage.getItem('hasCreatedDashboard') === 'true';
    }
  }
];

export default function ActivationChecklist() {
  const [isVisible, setIsVisible] = useState(true);
  const [completedItems, setCompletedItems] = useState(new Set());
  const { trackClick } = useMixpanelTracking();

  // Check for auto-completion on mount and periodically
  useEffect(() => {
    const checkAutoComplete = () => {
      const newCompleted = new Set();
      checklistItems.forEach(item => {
        if (item.autoComplete()) {
          newCompleted.add(item.id);
        }
      });
      setCompletedItems(newCompleted);
    };

    checkAutoComplete();

    // Check every 5 seconds for auto-completion
    const interval = setInterval(checkAutoComplete, 5000);
    return () => clearInterval(interval);
  }, []);

  // Don't show if dismissed
  useEffect(() => {
    const isDismissed = localStorage.getItem('activationChecklistDismissed') === 'true';
    if (isDismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('activationChecklistDismissed', 'true');
    setIsVisible(false);
    trackClick('Activation Checklist Dismissed', {
      completed_items: completedItems.size,
      total_items: checklistItems.length
    });
  };

  const handleItemClick = (item) => {
    trackClick('Activation Checklist Item Clicked', {
      item_id: item.id,
      item_title: item.title,
      is_completed: completedItems.has(item.id)
    });
  };

  const completionPercentage = (completedItems.size / checklistItems.length) * 100;
  const isFullyCompleted = completedItems.size === checklistItems.length;

  // Hide if fully completed for more than a day
  useEffect(() => {
    if (isFullyCompleted) {
      const completionTime = localStorage.getItem('activationChecklistCompletionTime');
      if (!completionTime) {
        localStorage.setItem('activationChecklistCompletionTime', Date.now().toString());
      } else {
        const daysSinceCompletion = (Date.now() - parseInt(completionTime)) / (1000 * 60 * 60 * 24);
        if (daysSinceCompletion > 1) {
          setIsVisible(false);
        }
      }
    }
  }, [isFullyCompleted]);

  const handleSetupClick = () => {
    trackClick('Get Started CTA Clicked', {
      location: 'Product Analytics',
      section: 'Welcome Card'
    });
    // Navigate to setup or open modal
    // For now, just log the action
    console.log('Setup tracking clicked');
  };

  return (
    <Collapse in={isVisible}>
      <Box sx={{ mb: 3 }}>
        <MainCard
          sx={{
            border: '2px solid',
            borderColor: 'primary.main',
            bgcolor: 'primary.lighter',
            '&:hover': {
              boxShadow: (theme) => theme.customShadows.z8
            }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <IconButton
              size="small"
              onClick={handleDismiss}
              sx={{
                position: 'absolute',
                right: -8,
                top: -8,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              <CloseOutlined style={{ fontSize: '14px' }} />
            </IconButton>

            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  👋 Welcome! Let's get you set up
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Install our tracking code to start seeing real analytics data from your application
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSetupClick}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3
                  }}
                >
                  Set Up Tracking
                </Button>
                <Button
                  variant="text"
                  size="large"
                  onClick={() => {
                    trackClick('View Documentation Link', {
                      location: 'Product Analytics',
                      section: 'Welcome Card'
                    });
                  }}
                  sx={{
                    textTransform: 'none',
                    color: 'text.secondary'
                  }}
                >
                  View documentation
                </Button>
              </Box>
            </Stack>
          </Box>
        </MainCard>
      </Box>
    </Collapse>
  );
}