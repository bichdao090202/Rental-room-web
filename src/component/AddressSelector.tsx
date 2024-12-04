import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { get } from '@/common/store/base.service';

interface Province {
  id: number;
  province_name: string;
  province_type: string;
}

interface District {
  id: number;
  district_name: string;
  district_type: string;
  province_id: number;
}

interface Ward {
  id: number;
  ward_name: string;
  ward_type: string;
  district_id: number;
}

interface LocationState {
  province_id: number | null;
  district_id: number | null;
  ward_id: number | null;
}

interface AddressSelectorProps {
  onLocationChange: (location: { province_id: number | null; district_id: number | null; ward_id: number | null }) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ onLocationChange }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const provinceSearchRef = useRef<HTMLInputElement>(null);
  const districtSearchRef = useRef<HTMLInputElement>(null);
  const wardSearchRef = useRef<HTMLInputElement>(null);

  const [provinceSearch, setProvinceSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [wardSearch, setWardSearch] = useState('');

  const [selectedLocation, setSelectedLocation] = useState<LocationState>({
    province_id: null,
    district_id: null,
    ward_id: null,
  });

  const compareLocations = (a: string, b: string) => {
    const normalize = (str: string) => {
      return str.normalize('NFD')
               .replace(/[\u0300-\u036f]/g, '')
               .toLowerCase();
    };

    const getNumber = (str: string) => {
      const match = normalize(str).match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };

    const aNum = getNumber(a);
    const bNum = getNumber(b);

    if (aNum && bNum) {
      return aNum - bNum;
    }
    return normalize(a).localeCompare(normalize(b));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provincesRes, districtsRes, wardsRes] = await Promise.all([
          get('geography/provinces'),
          get('geography/districts'),
          get('geography/wards'),
        ]);

        const provincesData = (await provincesRes).data;
        const districtsData = (await districtsRes).data;
        const wardsData = (await wardsRes).data;

        setProvinces(provincesData.sort((a: Province, b: Province) => 
          compareLocations(a.province_name, b.province_name)));
        setDistricts(districtsData.sort((a: District, b: District) => 
          compareLocations(a.district_name, b.district_name)));
        setWards(wardsData.sort((a: Ward, b: Ward) => 
          compareLocations(a.ward_name, b.ward_name)));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const normalizeText = (text: string) => {
    return text.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase();
  };

  const filteredProvinces = useMemo(() => {
    const searchNorm = normalizeText(provinceSearch);
    return provinces.filter(p => 
      normalizeText(p.province_type + ' ' + p.province_name)
        .includes(searchNorm)
    );
  }, [provinces, provinceSearch]);

  const filteredDistricts = useMemo(() => {
    if (!selectedLocation.province_id) return [];
    const searchNorm = normalizeText(districtSearch);
    return districts
      .filter(d => d.province_id === selectedLocation.province_id)
      .filter(d => 
        normalizeText(d.district_type + ' ' + d.district_name)
          .includes(searchNorm)
      );
  }, [districts, selectedLocation.province_id, districtSearch]);

  const filteredWards = useMemo(() => {
    if (!selectedLocation.district_id) return [];
    const searchNorm = normalizeText(wardSearch);
    return wards
      .filter(w => w.district_id === selectedLocation.district_id)
      .filter(w => 
        normalizeText(w.ward_type + ' ' + w.ward_name)
          .includes(searchNorm)
      );
  }, [wards, selectedLocation.district_id, wardSearch]);

  const handleProvinceChange = (event: SelectChangeEvent<number>) => {
    const newProvinceId = event.target.value as number;
    const updatedLocation = {
      province_id: newProvinceId,
      district_id: null,
      ward_id: null
    };
    setSelectedLocation(updatedLocation);
    setProvinceSearch('');
    setDistrictSearch('');
    setWardSearch('');
    onLocationChange(updatedLocation);
  };

  const handleDistrictChange = (event: SelectChangeEvent<number>) => {
    const newDistrictId = event.target.value as number;
    const updatedLocation = {
      province_id: selectedLocation.province_id, 
      district_id: newDistrictId,
      ward_id: null, 
    };
    setSelectedLocation(updatedLocation);
    setDistrictSearch('');
    setWardSearch('');
    onLocationChange(updatedLocation); 
  };
  
  const handleWardChange = (event: SelectChangeEvent<number>) => {
    const newWardId = event.target.value as number;
    const updatedLocation = {
      province_id: selectedLocation.province_id, 
      district_id: selectedLocation.district_id, 
      ward_id: newWardId,
    };
    setSelectedLocation(updatedLocation);
    setWardSearch('');
    onLocationChange(updatedLocation); 
  };
  

  const handleSelectOpen = (ref: React.RefObject<HTMLInputElement>) => {
    setTimeout(() => {
      ref.current?.focus();
    }, 0);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Tỉnh/Thành phố</InputLabel>
          <Select
            value={selectedLocation.province_id || ''}
            label="Tỉnh/Thành phố"
            onChange={handleProvinceChange}
            onOpen={() => handleSelectOpen(provinceSearchRef)}
          >
            <Box sx={{ p: 1 }}>
              <TextField
                inputRef={provinceSearchRef}
                size="small"
                placeholder="Tìm kiếm..."
                value={provinceSearch}
                onChange={(e) => setProvinceSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                fullWidth
              />
            </Box>
            {filteredProvinces.map((province) => (
              <MenuItem key={province.id} value={province.id}>
                {province.province_type} {province.province_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Quận/Huyện</InputLabel>
          <Select
            value={selectedLocation.district_id || ''}
            label="Quận/Huyện"
            onChange={handleDistrictChange}
            disabled={!selectedLocation.province_id}
            onOpen={() => handleSelectOpen(districtSearchRef)}
          >
            <Box sx={{ p: 1 }}>
              <TextField
                inputRef={districtSearchRef}
                size="small"
                placeholder="Tìm kiếm..."
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                fullWidth
              />
            </Box>
            {filteredDistricts.map((district) => (
              <MenuItem key={district.id} value={district.id}>
                {district.district_type} {district.district_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Phường/Xã</InputLabel>
          <Select
            value={selectedLocation.ward_id || ''}
            label="Phường/Xã"
            onChange={handleWardChange}
            disabled={!selectedLocation.district_id}
            onOpen={() => handleSelectOpen(wardSearchRef)}
          >
            <Box sx={{ p: 1 }}>
              <TextField
                inputRef={wardSearchRef}
                size="small"
                placeholder="Tìm kiếm..."
                value={wardSearch}
                onChange={(e) => setWardSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                fullWidth
              />
            </Box>
            {filteredWards.map((ward) => (
              <MenuItem key={ward.id} value={ward.id}>
                {ward.ward_type} {ward.ward_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default AddressSelector;