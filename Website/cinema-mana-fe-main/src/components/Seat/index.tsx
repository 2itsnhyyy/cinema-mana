interface Props<SeatType = any> {
  seat?: SeatType & { seatNumber: string };
  onSeatClick?: (seat: SeatType) => void;
  bgColor: string;
  color?: string;
  selected?: boolean;
  disabled?: boolean;
}
export type ForwardSeat = <RecordType extends any>(
  props: React.PropsWithChildren<Props<RecordType>>
) => React.ReactElement;

const SeatComponent: ForwardSeat = (props) => {
  const { seat, onSeatClick, bgColor, color } = props;
  return (
    <button
      onClick={() => {
        if (!props.disabled && seat) onSeatClick?.(seat);
      }}
      style={{
        backgroundColor: bgColor,
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: color || 'white',
        borderRadius: '8px',
        ...(!props.disabled &&
          props.selected && {
            border: '2px solid #fff',
          }),
      }}
    >
      {seat?.seatNumber}
    </button>
  );
};

export default SeatComponent;
