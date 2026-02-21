import React from 'react';
import {
  BiSearch,
  BiHeart,
  BiSolidHeart,
  BiCart,
  BiUserCircle,
  BiMenu,
  BiX,
  BiBoltCircle,
  BiCheckCircle,
  BiShow,
  BiPlus,
  BiMinus,
  BiBarChart,
  BiCube,
  BiShoppingBag,
  BiGroup,
  BiCog,
  BiHome,
  BiUser,
  BiLogOut,
  BiError,
  BiDollar,
  BiTrendingUp,
  BiMoney,
  BiStar,
  BiSolidFlame,
  BiCar,
  BiChat,
  BiMobile,
  BiEnvelope,
  BiMap,
  BiUndo,
  BiDiamond
} from 'react-icons/bi';

// Helper type for icon props
interface IconProps {
  className?: string;
  isFilled?: boolean;
}

// GENERIC ICONS
export const SearchIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <BiSearch className={className} />
);

export const HeartIcon: React.FC<IconProps> = ({ className = 'h-6 w-6', isFilled = false }) => (
  isFilled ? <BiSolidHeart className={className} /> : <BiHeart className={className} />
);

export const ShoppingCartIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <BiCart className={className} />
);

export const UserCircleIcon: React.FC<IconProps> = ({ className = 'h-8 w-8' }) => (
  <BiUserCircle className={className} />
);

export const Bars3Icon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <BiMenu className={className} />
);

export const XMarkIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <BiX className={className} />
);

export const BoltIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <BiBoltCircle className={className} />
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className = 'h-10 w-10' }) => (
  <BiCheckCircle className={className} />
);

export const EyeIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <BiShow className={className} />
);

export const PlusIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <BiPlus className={className} />
);

export const MinusIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <BiMinus className={className} />
);

// ADMIN & ACCOUNT ICONS
export const ChartBarIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <BiBarChart className={className} />
);

export const CubeIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <BiCube className={className} />
);

export const ShoppingBagIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <BiShoppingBag className={className} />
);

export const UsersIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <BiGroup className={className} />
);

export const Cog6ToothIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <BiCog className={className} />
);

export const HomeIcon: React.FC<IconProps> = ({ className = 'h-6 w-6' }) => (
  <BiHome className={className} />
);

export const UserIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <BiUser className={className} />
);

export const ArrowLeftOnRectangleIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <BiLogOut className={className} />
);

export const ExclamationTriangleIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <BiError className={className} />
);

// SUMMARY & FEATURE ICONS
export const CurrencyDollarIcon: React.FC<IconProps> = ({ className = 'h-10 w-10' }) => (
  <BiDollar className={className} />
);

export const ArrowTrendingUpIcon: React.FC<IconProps> = ({ className = 'h-10 w-10' }) => (
  <BiTrendingUp className={className} />
);

export const BanknotesIcon: React.FC<IconProps> = ({ className = 'h-10 w-10' }) => (
  <BiMoney className={className} />
);

export const SparklesIcon: React.FC<IconProps> = ({ className = 'h-8 w-8' }) => (
  <BiStar className={className} />
);

export const FireIcon: React.FC<IconProps> = ({ className = 'h-8 w-8' }) => (
  <BiSolidFlame className={className} />
);

export const TruckIcon: React.FC<IconProps> = ({ className = 'h-8 w-8' }) => (
  <BiCar className={className} />
);

export const ChatBubbleLeftRightIcon: React.FC<IconProps> = ({ className = 'h-8 w-8' }) => (
  <BiChat className={className} />
);

// CONTACT & INFO ICONS
export const DevicePhoneMobileIcon: React.FC<IconProps> = ({ className = 'text-2xl' }) => (
  <BiMobile className={className} />
);

export const EnvelopeIcon: React.FC<IconProps> = ({ className = 'text-2xl' }) => (
  <BiEnvelope className={className} />
);

export const MapPinIcon: React.FC<IconProps> = ({ className = 'text-2xl' }) => (
  <BiMap className={className} />
);

export const ArrowUturnRightIcon: React.FC<IconProps> = ({ className = 'h-8 w-8' }) => (
  <BiUndo className={className} />
);

export const DiamondIcon: React.FC<IconProps> = ({ className = 'h-8 w-8' }) => (
  <BiDiamond className={className} />
);
