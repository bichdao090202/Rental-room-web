import getRoomStatus from "@/app/manager/lessor/room/getRoomStatus";
import { formatCurrency } from "@/common/utils/helpers";
import { Room } from "@/types";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface RoomCardProps {
    room: Room;
    onClick: (id: number) => void;
  }

  const styles = {
    card: {
      maxWidth: 500,
      cursor: 'pointer',
    },
    media: {
      width: '100%',
      height: 200,
      objectFit: 'cover',
    },
    title: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'block',
    },
  } as const;
  
  const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
    return (
        <Card sx={styles.card} onClick={() => onClick(room.id)}>
        <CardMedia
          component="img"
          sx={styles.media}
          image={room.images[0]}
          alt={room.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" sx={styles.title}>
            {room.title}
          </Typography>
          <Typography gutterBottom variant="h6" component="div" color="orange">
            {formatCurrency(room.price)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`${isNaN(Number(room.address.ward_name)) ? room.address.ward_name : `Phường ${room.address.ward_name}`
                  }, ${isNaN(Number(room.address.district_name)) ? room.address.district_name : `Quận ${room.address.district_name}`
                  }, ${room.address.province_name}`}
          </Typography>
          <Typography gutterBottom variant="h6" component="div" sx={{ color: room.status === 1 ? 'green' : room.status === 2 ? 'gray' : 'red' }}>
            {getRoomStatus(room.status)}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  export default RoomCard;