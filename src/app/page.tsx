'use client'
import { get } from "@/common/store/base.service";
import AddressSelector from "@/component/AddressSelector";
import RoomCard from "@/component/RoomCard";
import SearchIcon from "@/component/icons/SearchIcon";
import theme from "@/styles/theme";
import { Box, Button, Card, CardContent, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Room } from '../types/index';

interface PriceRange {
  min: number;
  max: number;
}

const ROOM_TYPES = [
  { value: 'apartment', label: 'Căn hộ' },
  { value: 'room', label: 'Phòng trọ' },
  { value: 'dormitory', label: 'KTX' },
  { value: 'house', label: 'Nhà nguyên căn' },
];

const GENDER_OPTIONS = [
  { value: 'both', label: 'Tất cả' },
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
];


export default function Home() {
  const handleVerificationComplete = (verificationId: string) => {
    console.log('Verification ID:', verificationId);
  };
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roomType, setRoomType] = useState('all');
  const [gender, setGender] = useState('both');
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 10000000 });

  const [selectedLocation, setSelectedLocation] = useState<{ province_id: number | null; district_id: number | null; ward_id: number | null }>({
    province_id: null,
    district_id: null,
    ward_id: null,
  });

  const handleLocationChange = (location: { province_id: number | null; district_id: number | null; ward_id: number | null }) => {
    setSelectedLocation(location); 
    console.log('Location updated in parent:', location);
  };

  const [filters, setFilters] = useState({
    roomType: 'all',
    gender: 'both',
    priceRange: { min: 0, max: 10000000 }
  });

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await get(`rooms?page_id=1&per_page=-1`);
        setRooms(response.data);
      } catch (error) {
        setError('Failed to fetch rooms. Please try again later.');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);



  return (
    <Box component="section" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: '100%' }}>

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, md: 4 }
        }}
      >
        <Card
          sx={{
            mb: 4,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
            }
          }}
        >
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Tìm phòng trọ
              </Typography>

            </Box>


            <Stack spacing={3}>

              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'space-between' }}>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Địa chỉ:
                  </Typography>

                  <AddressSelector onLocationChange={handleLocationChange} />
                </Box>

                <FormControl sx={{ minWidth: 250 }}>
                  <InputLabel>Loại phòng</InputLabel>
                  <Select
                    value={filters.roomType}
                    label="Loại phòng"
                    onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                  >
                    <MenuItem value="all">Tất cả loại phòng</MenuItem>
                    {ROOM_TYPES.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    value={filters.gender}
                    label="Giới tính"
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  >
                    {GENDER_OPTIONS.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  sx={{
                    background: theme.palette.primary.main,
                    color: 'white',
                    height: "50px",
                    width: "100px"
                    // '&:hover': {
                    //   background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                    // }
                  }}
                >
                </Button>
              </Box>



              {/* <Box>
            <Typography variant="subtitle2" gutterBottom>
              Khoảng giá (triệu đồng)
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={[filters.priceRange.min, filters.priceRange.max]}
                onChange={(_, newValue) => {
                  if (Array.isArray(newValue)) { 
                    setFilters(prevFilters => ({ 
                      ...prevFilters, 
                      priceRange: { min: newValue[0], max: newValue[1] }
                    }));
                  }
                }}
                valueLabelDisplay="auto"
                min={0}
                max={10000000}
                step={500000}
                valueLabelFormat={(value) => `${(value/1000000).toFixed(1)}tr`}
              />
            </Box>
          </Box> */}


            </Stack>
          </CardContent>
        </Card>



        <Typography variant="h5" sx={{ mb: 3 }}>Phòng trọ nổi bật</Typography>
        <Grid
          container
          spacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ mb: 6 }}
        >
          {rooms.slice(0, 4).map((room) => (
            <Grid item xs={12} sm={6} md={3} key={room.id}>
              <RoomCard room={room} onClick={(id) => router.push(`/room/${id}`)} />
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ mb: 3 }}>Gần chỗ bạn</Typography>
        <Grid
          container
          spacing={{ xs: 1, sm: 2, md: 2.5 }}
        >
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={3} key={room.id}>
              <RoomCard room={room} onClick={(id) => router.push(`/room/${id}`)} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}