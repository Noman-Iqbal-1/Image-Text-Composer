export const initializeFabric = async () => {
  const fabric = await import('fabric');
  
  return {
    Canvas: fabric.Canvas,
    Rect: fabric.Rect,
    Circle: fabric.Circle,
    Triangle: fabric.Triangle,
    IText: fabric.IText,
    Textbox: fabric.Textbox,
    FabricImage: fabric.FabricImage,
    filters: fabric.filters,
    util: fabric.util,
  };
};