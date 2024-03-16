type ButtonColorProps = 'blue.400' | 'gray.700' | 'gray.300';

export interface ButtonViewModel {
  getPressedBgColor: (bgColor: ButtonColorProps) => string;
}

function useButtonViewModel(): ButtonViewModel {
  function getPressedBgColor(bgColor: ButtonColorProps): string {
    const bgColorArray = bgColor.split('.');
    const prefixBgColor = bgColorArray[0];
    const alphaBgColor = Number(bgColorArray[1].split('0')[0]);
    const pressedBgColor = `${prefixBgColor}.${String(alphaBgColor - 1)}00`;

    return pressedBgColor;
  }

  return {
    getPressedBgColor,
  };
}

export { useButtonViewModel };
