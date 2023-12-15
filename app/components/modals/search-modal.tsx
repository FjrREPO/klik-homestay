'use client'

import qs from 'query-string'
import { useCallback, useMemo, useState, useEffect } from "react"
import { Range } from 'react-date-range'
import { formatISO } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import Select from 'react-select'
import axios from 'axios'

import useSearchModal from "@/app/hooks/useSearchModal"

import Modal from "./modal"
import Calendar from "../inputs/calendar"
import Counter from "../inputs/counter"
import Heading from '../heading'

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

interface Province {
  id: string;
  name: string;
}

interface QueryParams {
  province: string;
  regency: string;
  district: string;
  village: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  startDate: string | undefined;
  endDate: string | undefined;
  selectedLabel?: string;
}

const SearchModal = () => {
  const router = useRouter()
  const searchModal = useSearchModal()
  const params = useSearchParams()

  const [step, setStep] = useState(STEPS.LOCATION)
  const [guestCount, setGuestCount] = useState(1)
  const [roomCount, setRoomCount] = useState(1)
  const [bathroomCount, setBathroomCount] = useState(1)
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regency, setRegency] = useState<Province[]>([]);
  const [district, setDistrict] = useState<Province[]>([]);
  const [village, setVillage] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<{ value: string; label: string } | null>(null)
  const [selectedRegency, setSelectedRegency] = useState<{ value: string; label: string } | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<{ value: string; label: string } | null>(null)
  const [selectedVillage, setSelectedVillage] = useState<{ value: string; label: string } | null>(null)
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  })

  const fetchProvinces = async () => {
    try {
      const response = await axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
      setProvinces(response.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchRegencies = (provinceId: string) => {
    axios
      .get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`)
      .then((response) => {
        setRegency(response.data);
      })
      .catch((error) => {
        console.error('Error fetching regencies:', error);
      });
  };

  useEffect(() => {
    if (selectedProvince) {
      fetchRegencies(selectedProvince.value);
    }
  }, [selectedProvince]);

  const fetchDistricts = (regencyId: string) => {
    axios
      .get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`)
      .then((response) => {
        setDistrict(response.data);
      })
      .catch((error) => {
        console.error('Error fetching districts:', error);
      });
  };

  useEffect(() => {
    if (selectedRegency) {
      fetchDistricts(selectedRegency.value);
    }
  }, [selectedRegency]);

  const fetchVillages = (districtId: string) => {
    axios
      .get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`)
      .then((response) => {
        setVillage(response.data);
      })
      .catch((error) => {
        console.error('Error fetching villages:', error);
      });
  };

  useEffect(() => {
    if (selectedDistrict) {
      fetchVillages(selectedDistrict.value);
    }
  }, [selectedDistrict]);

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: QueryParams = {
      ...currentQuery,
      province: selectedProvince?.label.toLowerCase() || '',
      regency: selectedRegency?.label.toLowerCase() || '',
      district: selectedDistrict?.label.toLowerCase() || '',
      village: selectedVillage?.label.toLowerCase() || '',
      guestCount,
      roomCount,
      bathroomCount,
      startDate: dateRange.startDate ? formatISO(dateRange.startDate) : undefined,
      endDate: dateRange.endDate ? formatISO(dateRange.endDate) : undefined,
    };

    const queryParams: qs.StringifiableRecord = {
      province: selectedProvince?.label.toLowerCase() || '',
      regency: selectedRegency?.label.toLowerCase() || '',
      district: selectedDistrict?.label.toLowerCase() || '',
      village: selectedVillage?.label.toLowerCase() || '',
      guestCount,
      roomCount,
      bathroomCount,
      startDate: dateRange.startDate ? formatISO(dateRange.startDate) : undefined,
      endDate: dateRange.endDate ? formatISO(dateRange.endDate) : undefined,
    };

    if (selectedProvince?.label) {
      queryParams.province = selectedProvince.label.toLowerCase();
    }
    if (selectedRegency?.label) {
      queryParams.regency = selectedRegency.label.toLowerCase();
    }
    if (selectedDistrict?.label) {
      queryParams.district = selectedDistrict.label.toLowerCase();
    }
    if (selectedVillage?.label) {
      queryParams.village = selectedVillage.label.toLowerCase();
    }
    queryParams.guestCount = guestCount;
    queryParams.roomCount = roomCount;
    queryParams.bathroomCount = bathroomCount;
    queryParams.startDate = dateRange.startDate ? formatISO(dateRange.startDate) : undefined;
    queryParams.endDate = dateRange.endDate ? formatISO(dateRange.endDate) : undefined;

    const url = qs.stringifyUrl(
      {
        url: '/',
        query: queryParams,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [
    step,
    searchModal,
    router,
    guestCount,
    roomCount,
    dateRange,
    onNext,
    bathroomCount,
    params,
    selectedProvince?.label,
    selectedRegency?.label,
    selectedDistrict?.label,
    selectedVillage?.label,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search'
    }

    return 'Lanjut'
  }, [step])

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined
    }

    return 'Kembali'
  }, [step])

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Kemana anda akan pergi?"
        subtitle="Cari lokasi yang sempurna!"
      />
      <Select
        placeholder="Pilih provinsi (Opsional)"
        isClearable
        aria-label="province"
        options={provinces.map((province) => ({
          value: province.id,
          label: province.name,
        }))}
        value={selectedProvince}
        onChange={(option) => setSelectedProvince(option)}
        formatOptionLabel={(option: any) => (
          <div className='flex flex-row items-center gap-3'>
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => 'p-3 border-2',
          input: () => 'text-lg',
          option: () => 'text-lg',
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: 'black',
            primary25: '#ffe4e6',
          },
        })}
      />
      <Select
        placeholder="Pilih kabupaten/kota (Opsional)"
        isClearable
        aria-label="regency"
        options={regency.map((regencies) => ({
          value: regencies.id,
          label: regencies.name,
        }))}
        value={selectedRegency}
        onChange={(option) => setSelectedRegency(option)}
        formatOptionLabel={(option: any) => (
          <div className='flex flex-row items-center gap-3'>
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => 'p-3 border-2',
          input: () => 'text-lg',
          option: () => 'text-lg',
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: 'black',
            primary25: '#ffe4e6',
          },
        })}
      />
      <Select
        placeholder="Pilih kecamatan (Opsional)"
        isClearable
        aria-label="district"
        options={district.map((districts) => ({
          value: districts.id,
          label: districts.name,
        }))}
        value={selectedDistrict}
        onChange={(option) => setSelectedDistrict(option)}
        formatOptionLabel={(option: any) => (
          <div className='flex flex-row items-center gap-3'>
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => 'p-3 border-2',
          input: () => 'text-lg',
          option: () => 'text-lg',
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: 'black',
            primary25: '#ffe4e6',
          },
        })}
      />
      <Select
        placeholder="Pilih desa (Opsional)"
        isClearable
        aria-label="village"
        options={village.map((villages) => ({
          value: villages.id,
          label: villages.name,
        }))}
        value={selectedVillage}
        onChange={(option) => setSelectedVillage(option)}
        formatOptionLabel={(option: any) => (
          <div className='flex flex-row items-center gap-3'>
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => 'p-3 border-2',
          input: () => 'text-lg',
          option: () => 'text-lg',
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: 'black',
            primary25: '#ffe4e6',
          },
        })}
      />
    </div>
  )

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Kapan anda berencana untuk pergi?"
          subtitle="Pastikan semua sedang senggang!"
        />
        <Calendar
          onChange={(value) => setDateRange(value.selection)}
          value={dateRange}
        />
      </div>
    )
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Informasi lebih lanjut"
          subtitle="Cari tempat paling sempurna"
        />
        <Counter
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
          title="Tamu"
          subtitle="Berapa tamu yang datang?"
        />
        <hr />
        <Counter
          onChange={(value) => setRoomCount(value)}
          value={roomCount}
          title="Ruangan"
          subtitle="Ada berapa ruangan yang kamu butuhkan?"
        />
        <hr />
        <Counter
          onChange={(value) => {
            setBathroomCount(value)
          }}
          value={bathroomCount}
          title="Kamar mandi"
          subtitle="Ada berapa kamar mandi yang kamu butuhkan?"
        />
      </div>
    )
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Filter"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  )
}

export default SearchModal